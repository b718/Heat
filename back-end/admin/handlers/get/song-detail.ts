import type { Context } from "hono";

import { getLogger } from "../../../logger/logger";
import type { SongRepository } from "../../repositories/song-repository";
import type { ErrorResponse } from "../../types/types";

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
				const response: ErrorResponse = { ok: false, error: "song not found" };
				return c.json(response, 404);
			}
			return c.json(detail);
		} catch (err) {
			logger.error({ err, songId }, "failed to fetch song detail for admin");
			const response: ErrorResponse = { ok: false, error: "failed to fetch song detail" };
			return c.json(response, 500);
		}
	};
}
