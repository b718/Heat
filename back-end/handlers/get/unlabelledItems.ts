import type { UnlabelledItemsResponse } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { ArtistRepository } from "../../modules/repositories/artist/artist-repository";
import type { SongRepository } from "../../modules/repositories/song/song-repository";

export function unlabelledItems(songRepository: SongRepository, artistRepository: ArtistRepository) {
	return async (c: Context) => {
		const logger = getLogger(__filename);
		try {
			const [unlabelledArtists, unlabelledSongs] = await Promise.all([
				artistRepository.fetchUnlabelledArtists(),
				songRepository.fetchUnlabelledSongs(),
			]);
			const unlabelledItems: UnlabelledItemsResponse = {
				artists: unlabelledArtists,
				songs: unlabelledSongs,
			};
			return c.json(unlabelledItems);
		} catch (err) {
			logger.error({ err }, "failed to fetch label items");
			return c.json({ ok: false }, 500);
		}
	};
}
