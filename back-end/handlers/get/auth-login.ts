import type { Context } from "hono";

const SCOPES = "streaming user-read-email user-read-private user-modify-playback-state";
const REDIRECT_URI = "http://127.0.0.1:3001/auth/callback";

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

	return c.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}
