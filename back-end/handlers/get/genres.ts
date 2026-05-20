import type { Genres } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";

const logger = getLogger(__filename);

export async function genres(c: Context) {
	try {
		logger.info("loading genres from disk");
		const file = Bun.file(new URL("../../data/genres/genres.json", import.meta.url));
		const response: Genres = await file.json();
		logger.info({ count: Object.keys(response).length }, "loaded genres");
		return c.json(response);
	} catch (err) {
		logger.error({ err }, "failed to read genres");
		return c.json({ ok: false }, 500);
	}
}
