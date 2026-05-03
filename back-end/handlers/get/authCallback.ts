import type { AccessToken } from "@heat/types";
import type { Context } from "hono";

const REDIRECT_URI = "http://127.0.0.1:3001/auth/callback";
const HEAT_HOME_PAGE_URL = "http://localhost:3000";

let accessToken = "";
export function getAccessToken() {
	return accessToken;
}

export async function authCallback(c: Context) {
	const code = c.req.query("code");
	if (!code) return c.text("Missing code", 400);

	const clientId = process.env.SPOTIFY_CLIENT_ID!;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
	const body = new URLSearchParams({
		code,
		grant_type: "authorization_code",
		redirect_uri: REDIRECT_URI,
	});

	try {
		const response = await fetch("https://accounts.spotify.com/api/token", {
			method: "POST",
			headers: {
				Authorization: `Basic ${credentials}`,
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: body.toString(),
		});

		const data = (await response.json()) as AccessToken;
		accessToken = data.access_token ?? "";
	} catch (err) {
		return c.text("Token exchange failed", 500);
	}

	return c.redirect(HEAT_HOME_PAGE_URL);
}
