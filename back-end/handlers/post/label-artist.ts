import type { LabelArtistRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { ArtistRepository } from "../../modules/repositories/artist/artist-repository";

const logger = getLogger(__filename);

export function labelArtist(artistRepository: ArtistRepository) {
	return async (c: Context) => {
		try {
			const body: LabelArtistRequest = await c.req.json();
			logger.info(
				{ artistId: body.artistId, artistName: body.artistName, genres: body.genres },
				"storing artist labels",
			);
			await artistRepository.storeArtistLabels(body.artistId, body.artistName, body.genres);
			logger.info(
				{ artistId: body.artistId, artistName: body.artistName },
				"stored artist labels",
			);
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err }, "failed to store artist label");
			return c.json({ ok: false }, 500);
		}
	};
}
