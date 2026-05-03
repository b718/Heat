import type { Directon } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";

const logger = getLogger();

export async function skip(c: Context) {
	const body = await c.req.json<{ direction: Directon }>();
	logger.info({ direction: body.direction }, "track skipped");
	return c.json({ ok: true });
}
