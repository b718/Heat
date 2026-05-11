import { UNLABELLED_SONGS_LIMIT } from "@heat/consts";
import type { Genre, SongForLabelling, SongInformation } from "@heat/types";
import type { Logger } from "pino";

import type { PrismaClient } from "../../../generated/prisma/client";
import { ErrorRepository } from "../../error/error-repository";
import getGenres from "../utilities/get-genres";
import type { SongRepository } from "./song-repository";

export class SongRepositoryPrisma implements SongRepository {
	readonly type = "song-repository-prisma";

	private readonly client: PrismaClient;
	private readonly logger: Logger;

	constructor(client: PrismaClient, logger: Logger) {
		this.client = client;
		this.logger = logger.child({ name: __filename, nametype: this.type });
	}

	async fetchUnlabelledSongs(): Promise<SongForLabelling[]> {
		try {
			this.logger.info("fetching unlabelled songs");
			const artists = await this.client.$queryRaw<{ id: string; name: string }[]>`
							SELECT id, name FROM "Song"
							WHERE cardinality(genres) = 0
							ORDER BY RANDOM()
							LIMIT ${UNLABELLED_SONGS_LIMIT}
						`;
			this.logger.info({ count: artists.length }, "fetched unlabelled songs");
			return artists;
		} catch (err) {
			this.logger.info("failed to fetch unlabelled songs");
			throw new ErrorRepository(err, this.type);
		}
	}

	async storeSong(data: SongInformation): Promise<void> {
		try {
			this.logger.info({ songId: data.id, name: data.name }, "storing song");
			await this.client.song.upsert({
				where: { id: data.id },
				update: data,
				create: data,
			});
			this.logger.info({ songId: data.id, name: data.name }, "stored song");
		} catch (err) {
			this.logger.error({ err, songId: data.id, name: data.name }, "failed to store song");
			throw new ErrorRepository(err, this.type);
		}
	}

	async storeSongLabels(songId: string, songName: string, genres: Genre[]): Promise<void> {
		try {
			this.logger.info({ songId, songName }, "storing song label");
			await this.client.songGenreLabel.create({
				data: { songId, labelledGenres: getGenres(genres) },
			});
			this.logger.info({ songId, songName }, "stored song label");
		} catch (err) {
			this.logger.error({ err, songId, songName }, "failed to store song labels");
			throw new ErrorRepository(err, this.type);
		}
	}
}
