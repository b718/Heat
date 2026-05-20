import type { UnlabelledItemsResponse } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { ArtistRepository } from "../../modules/repositories/artist/artist-repository";
import type { SongRepository } from "../../modules/repositories/song/song-repository";

const logger = getLogger(__filename);

export function unlabelledItems(songRepository: SongRepository, artistRepository: ArtistRepository) {
	return async (c: Context) => {
		try {
			logger.debug("fetching unlabelled artists and songs");
			const [unlabelledArtists, unlabelledSongs] = await Promise.all([
				artistRepository.fetchUnlabelledArtists(),
				songRepository.fetchUnlabelledSongs(),
			]);
			const unlabelledItems: UnlabelledItemsResponse = {
				artists: unlabelledArtists,
				songs: unlabelledSongs,
			};
			logger.info(
				{ artistCount: unlabelledArtists.length, songCount: unlabelledSongs.length },
				"fetched unlabelled items",
			);
			return c.json(unlabelledItems);
		} catch (err) {
			logger.error({ err }, "failed to fetch label items");
			return c.json({ ok: false }, 500);
		}
	};
}
