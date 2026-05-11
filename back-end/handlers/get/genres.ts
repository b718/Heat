import type { Genres } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";

export async function genres(c: Context) {
	const logger = getLogger(__filename);
	try {
		const file = Bun.file(new URL("../../data/genres/genres.json", import.meta.url));
		const response: Genres = await file.json();
		return c.json(response);
	} catch (err) {
		logger.error({ err }, "failed to read genres");
		return c.json({ ok: false }, 500);
	}
}
