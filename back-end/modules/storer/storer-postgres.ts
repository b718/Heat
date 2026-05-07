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

	async store(result: ParsedResult): Promise<void> {
		try {
			this.logger.info({ songId: result.song.id, songName: result.song.name }, "storing request");
			await this.insertSong(result.song);
			await this.insertArtists(result.artists);
			await this.insertSkip(result.skip);
			this.logger.info({ songId: result.song.id, songName: result.song.name }, "stored request");
		} catch (err) {
			this.logger.error(
				{ err, songId: result.song.id, songName: result.song.name },
				"failed to store request",
			);
			throw new ErrorStorer(err);
		}
	}

	private async insertSong(song: SongInformation): Promise<void> {
		this.logger.info({ id: song.id }, "creating song");
		await this.client.song.upsert({
			where: { id: song.id },
			update: song,
			create: song,
		});
		this.logger.info({ id: song.id }, "created song");
	}

	private async insertArtists(artists: ArtistInformation[]): Promise<void> {
		this.logger.info({ count: artists.length }, "creating artist(s)");
		await Promise.all(
			artists.map(async (artist) => {
				const { relatedSongId, ...artistData } = artist;
				await this.client.artist.upsert({
					where: { id: artist.id },
					update: { ...artistData, songs: { connect: { id: relatedSongId } } },
					create: { ...artistData, songs: { connect: { id: relatedSongId } } },
				});
			}),
		);
		this.logger.info({ count: artists.length }, "created artist(s)");
	}

	private async insertSkip(skip: SkipInformation): Promise<void> {
		const { relatedSongId, ...skipData } = skip;
		this.logger.info({ songId: relatedSongId, direction: skip.direction }, "creating skip");
		await this.client.skip.create({ data: { ...skipData, songId: relatedSongId } });
		this.logger.info({ songId: relatedSongId, direction: skip.direction }, "created skip");
	}
}
