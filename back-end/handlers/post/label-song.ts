import type { LabelSongRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { SongRepository } from "../../modules/repositories/song/song-repository";

const logger = getLogger(__filename);

export function labelSong(songRepository: SongRepository) {
	return async (c: Context) => {
		try {
			const body: LabelSongRequest = await c.req.json();
			logger.info(
				{ songId: body.songId, songName: body.songName, genres: body.genres },
				"storing song labels",
			);
			await songRepository.storeSongLabels(body.songId, body.songName, body.genres);
			logger.info({ songId: body.songId, songName: body.songName }, "stored song labels");
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err }, "failed to store song label");
			return c.json({ ok: false }, 500);
		}
	};
}
