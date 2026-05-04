import type { SkipRequest } from "@heat/types";
import { PrismaPg } from "@prisma/adapter-pg";
import type { Logger } from "pino";

import { PrismaClient } from "../../generated/prisma/client";
import { getLogger } from "../../logger/logger";
import { ErrorStorer } from "../error/error-storer";
import type { Storer } from "./storer";

export class StorerPostgres implements Storer {
	readonly storerType = "postgres";

	private readonly client: PrismaClient;
	private readonly logger: Logger;

	constructor() {
		this.client = new PrismaClient({
			adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
		});
		this.logger = getLogger().child({ storerType: this.storerType });
	}

	async upload(request: SkipRequest): Promise<void> {
		try {
			this.logger.info({ songId: request.songId, songName: request.songName }, "uploading request");
			await this.insertNewSong(request);
			await this.insertNewSkip(request);
			this.logger.info({ songId: request.songId, songName: request.songName }, "uploaded request");
		} catch (err) {
			this.logger.error(
				{ err, songId: request.songId, songName: request.songName },
				"failed to upload request",
			);
			throw new ErrorStorer(err);
		}
	}

	private async insertNewSong(request: SkipRequest): Promise<void> {
		this.logger.info({ id: request.songId }, "creating song");
		const songToBeInserted = {
			id: request.songId,
			name: request.songName,
			artists: request.songArtists.map((songArtist) => songArtist.name),
		};
		await this.client.song.upsert({
			where: {
				id: request.songId,
			},
			update: songToBeInserted,
			create: songToBeInserted,
		});
		this.logger.info({ id: request.songId }, "created song");
	}

	private async insertNewSkip(request: SkipRequest): Promise<void> {
		this.logger.info({ songId: request.songId, direction: request.direction }, "creating skip");
		await this.client.skip.create({
			data: {
				direction: request.direction,
				currentTime: request.currentTime,
				duration: request.duration,
				songId: request.songId,
			},
		});
		this.logger.info({ songId: request.songId, direction: request.direction }, "created skip");
	}
}
