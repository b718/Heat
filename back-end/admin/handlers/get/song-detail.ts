import type { Context } from "hono";

import { getLogger } from "../../../logger/logger";
import type { SongRepository } from "../../repositories/song-repository";

const logger = getLogger(__filename);

export function songDetail(songRepository: SongRepository) {
	return async (c: Context) => {
		const songId = c.req.param("id");
		try {
			if (!songId) throw new Error("songId is undefined");

			logger.info({ songId }, "fetching song detail for admin");
			const detail = await songRepository.fetchSongDetail(songId);
			if (detail === null) {
				logger.info({ songId }, "song detail not found");
				return c.json({ ok: false }, 404);
			}
			return c.json(detail);
		} catch (err) {
			logger.error({ err, songId }, "failed to fetch song detail for admin");
			return c.json({ ok: false }, 500);
		}
	};
}
