import type { Context } from "hono";

import { getLogger } from "../../logger/logger";

const SCOPES = "streaming user-read-email user-read-private user-modify-playback-state";
const REDIRECT_URI = process.env.REDIRECT_URI!;

const logger = getLogger(__filename);

export async function authLogin(c: Context) {
	const clientId = process.env.SPOTIFY_CLIENT_ID!;
	const state = crypto.randomUUID();
	const params = new URLSearchParams({
		response_type: "code",
		client_id: clientId,
		scope: SCOPES,
		redirect_uri: REDIRECT_URI,
		state,
	});

	logger.info({ state }, "redirecting user to spotify authorize endpoint");
	return c.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
