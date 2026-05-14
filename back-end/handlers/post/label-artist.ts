import type { LabelArtistRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { ArtistRepository } from "../../modules/repositories/artist/artist-repository";

export function labelArtist(artistRepository: ArtistRepository) {
	return async (c: Context) => {
		const logger = getLogger(__filename);
		try {
			const body: LabelArtistRequest = await c.req.json();
			await artistRepository.storeArtistLabels(body.artistId, body.artistName, body.genres);
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err }, "failed to store artist label");
			return c.json({ ok: false }, 500);
		}
	};
}
