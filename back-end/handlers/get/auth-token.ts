import type { AccessToken } from "@heat/types";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";

import { getAccessToken } from "./auth-callback";

export async function authToken(c: Context) {
	const response: AccessToken = {
		access_token: getAccessToken(),
	};

	return c.json(response);
}
