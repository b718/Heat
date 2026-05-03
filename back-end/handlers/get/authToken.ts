import type { AccessToken } from "@heat/types";
import type { Context } from "hono";

import { getAccessToken } from "./authCallback";

export async function authToken(c: Context) {
	const response: AccessToken = {
		access_token: getAccessToken(),
	};
	return c.json(response);
}
