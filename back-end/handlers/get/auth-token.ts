import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import { getSession } from "../../modules/sessions/session-store";

const logger = getLogger(__filename);

export async function authToken(c: Context) {
	const sessionId = c.req.query("session_id");
	if (!sessionId) {
		logger.warn("auth/token request missing session_id");
		return c.json({ error: "Missing session_id" }, 401);
	}

	const session = getSession(sessionId);
	if (!session) {
		logger.warn({ sessionId }, "auth/token request for unknown session");
		return c.json({ error: "Invalid session" }, 401);
	}

	return c.json({ access_token: session?.accessToken || "" });
}
