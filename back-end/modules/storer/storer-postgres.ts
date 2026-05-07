import type {
	ArtistInformation,
	ParsedResult,
	SkipInformation,
	SkipRequest,
	SongInformation,
} from "@heat/types";
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

	async upload(result: ParsedResult): Promise<void> {
		try {
			this.logger.info({ songId: result.song.id, songName: result.song.name }, "uploading request");
			await this.insertNewSong(result.song);
			await this.insertNewArtists(result.artists);
			await this.insertNewSkip(result.skip);
			this.logger.info({ songId: result.song.id, songName: result.song.name }, "uploaded request");
		} catch (err) {
			this.logger.error(
				{ err, songId: result.song.id, songName: result.song.name },
				"failed to upload request",
			);
			throw new ErrorStorer(err);
		}
	}

	private async insertNewSong(song: SongInformation): Promise<void> {
		this.logger.info({ id: song.id }, "creating song");
		await this.client.song.upsert({
			where: { id: song.id },
			update: song,
			create: song,
		});
		this.logger.info({ id: song.id }, "created song");
	}

	private async insertNewArtists(artists: ArtistInformation[]): Promise<void> {
		this.logger.info({ count: artists.length }, "creating artist(s)");
		await Promise.all(
			artists.map(async (artist) => {
				await this.client.artist.upsert({
					where: { id: artist.id },
					update: { ...artist, songs: { connect: { id: artist.relatedSongId } } },
					create: { ...artist, songs: { connect: { id: artist.relatedSongId } } },
				});
			}),
		);
		this.logger.info({ count: artists.length }, "created artist(s)");
	}

	private async insertNewSkip(skip: SkipInformation): Promise<void> {
		this.logger.info({ songId: skip.relatedSongId, direction: skip.direction }, "creating skip");
		await this.client.skip.create({
			data: { ...skip, songId: skip.relatedSongId },
		});
		this.logger.info({ songId: skip.relatedSongId, direction: skip.direction }, "created skip");
	}
}
