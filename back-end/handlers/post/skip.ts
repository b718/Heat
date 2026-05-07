import type { Directon, SkipRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { Storer } from "../../modules/storer/storer";

const logger = getLogger();

export function skip(storer: Storer) {
	return async function (c: Context) {
		try {
			const body: SkipRequest = await c.req.json();
			logger.info(
				{ direction: body.direction, songId: body.songId, songName: body.songName },
				"track skipped",
			);
			await storer.upload(body);
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err }, "failed to handle skip request");
			return c.json({ ok: false }, 500);
		}
	};
}
