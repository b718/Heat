import type { Context } from "hono";

import { getLogger } from "../../../logger/logger";
import type { SongRepository } from "../../repositories/song-repository";

const logger = getLogger(__filename);

export function songs(songRepository: SongRepository) {
	return async (c: Context) => {
		try {
			logger.info("fetching all songs for admin");
			const songs = await songRepository.fetchAllSongs();
			logger.info({ count: songs.length }, "fetched all songs for admin");
			return c.json(songs);
		} catch (err) {
			logger.error({ err }, "failed to fetch songs for admin");
			return c.json({ ok: false }, 500);
		}
	};
}
