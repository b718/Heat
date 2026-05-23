import type { Context } from "hono";

import { getLogger } from "../../../logger/logger";
import { GENRE_OPTIONS } from "../../consts/genres";
import type { SongRepository } from "../../repositories/song-repository";
import type { ErrorResponse, UpdateSongGenresRequest } from "../../types/types";

const logger = getLogger(__filename);

const ALLOWED_GENRES = new Set(GENRE_OPTIONS);

export function updateSongGenres(songRepository: SongRepository) {
	return async (c: Context) => {
		const songId = c.req.param("id");
		try {
			if (!songId) throw new Error("songId is undefined");

			const body: UpdateSongGenresRequest = await c.req.json().catch(() => null);
			if (!body) {
				logger.warn({ songId }, "invalid json body when updating song genres");
				const response: ErrorResponse = { ok: false, error: "invalid json body" };
				return c.json(response, 400);
			}

			const genres = body.genres;
			const invalid = genres.filter((g) => !ALLOWED_GENRES.has(g));
			if (invalid.length > 0) {
				logger.warn({ songId, invalid }, "rejected unknown genres when updating song");
				const response: ErrorResponse = {
					ok: false,
					error: `unknown genres: ${invalid.join(", ")}`,
				};
				return c.json(response, 400);
			}

			logger.info({ songId, genreCount: genres.length, genres }, "updating song genres for admin");
			const updated = await songRepository.updateSongGenres(songId, genres);
			if (!updated) {
				logger.info({ songId }, "song not found when updating genres for admin");
				const response: ErrorResponse = { ok: false, error: "song not found" };
				return c.json(response, 404);
			}

			logger.info({ songId, genreCount: genres.length }, "updated song genres for admin");
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err, songId }, "failed to update song genres for admin");
			const response: ErrorResponse = { ok: false, error: "failed to update song genres" };
			return c.json(response, 500);
		}
	};
}
