import type { LabelSongRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { SongRepository } from "../../modules/repositories/song/song-repository";

export function labelSong(songRepository: SongRepository) {
	return async (c: Context) => {
		const logger = getLogger(__filename);
		try {
			const body: LabelSongRequest = await c.req.json();
			await songRepository.storeSongLabels(body.songId, body.songName, body.genres);
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err }, "failed to store song label");
			return c.json({ ok: false }, 500);
		}
	};
}
