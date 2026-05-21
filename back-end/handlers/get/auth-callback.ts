import { SECONDS_TO_MILLISECONDS } from "@heat/consts";
import type { AccessToken } from "@heat/types";
import { randomUUIDv7 } from "bun";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import { setSession } from "../../modules/sessions/session-store";

const REDIRECT_URI = process.env.REDIRECT_URI!;
const HEAT_HOME_PAGE_URL = process.env.HEAT_HOME_PAGE_URL!;

const logger = getLogger(__filename);

export async function authCallback(c: Context) {
	const code = c.req.query("code");
	if (!code) {
		logger.warn("auth/callback request missing code");
		return c.text("Missing code", 400);
	}

	const sessionId = randomUUIDv7();
	const clientId = process.env.SPOTIFY_CLIENT_ID!;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
	const body = new URLSearchParams({
		code,
		grant_type: "authorization_code",
		redirect_uri: REDIRECT_URI,
	});

	try {
		logger.info({ sessionId }, "exchanging spotify auth code for access token");
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		const data = (await response.json()) as AccessToken;
		setSession(sessionId, {
			accessToken: data.access_token,
			refreshToken: data.refresh_token,
			expiresAt: Date.now() + data.expires_in * SECONDS_TO_MILLISECONDS,
		});
		logger.info({ sessionId }, "spotify token exchange succeeded, session stored");
	} catch (err) {
		logger.error({ err, sessionId }, "spotify token exchange failed");
		return c.text("Token exchange failed", 500);
	}

	return c.redirect(HEAT_HOME_PAGE_URL + `?` + `session_id=${sessionId}`);
}
