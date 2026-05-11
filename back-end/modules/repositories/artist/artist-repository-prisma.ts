import { UNLABELLED_ARTISTS_LIMIT } from "@heat/consts";
import type { ArtistForLabelling, ArtistInformation, Genre } from "@heat/types";
import type { Logger } from "pino";

import type { PrismaClient } from "../../../generated/prisma/client";
import { ErrorRepository } from "../../error/error-repository";
import getGenres from "../utilities/get-genres";
import type { ArtistRepository } from "./artist-repository";

export class ArtistRepositoryPrisma implements ArtistRepository {
	readonly type = "artist-repository-prisma";

	private readonly client: PrismaClient;
	private readonly logger: Logger;

	constructor(client: PrismaClient, logger: Logger) {
		this.client = client;
		this.logger = logger.child({ name: __filename, type: this.type });
	}

	async fetchUnlabelledArtists(): Promise<ArtistForLabelling[]> {
		try {
			this.logger.info("fetching unlabelled artists");
			const artists = await this.client.$queryRaw<{ id: string; name: string }[]>`
					SELECT id, name FROM "Artist"
					WHERE cardinality(genres) = 0
					ORDER BY RANDOM()
					LIMIT ${UNLABELLED_ARTISTS_LIMIT}
				`;
			this.logger.info({ count: artists.length }, "fetched unlabelled artists");
			return artists;
		} catch (err) {
			this.logger.info("failed to fetch unlabelled artists");
			throw new ErrorRepository(err, this.type);
		}
	}

	async storeArtists(data: ArtistInformation[]): Promise<void> {
		try {
			this.logger.info({ count: data.length }, "storing artist(s)");
			await Promise.all(
				data.map(async (artist) => {
					const { relatedSongId, ...artistData } = artist;
					await this.client.artist.upsert({
						where: { id: artist.id },
						update: { ...artistData, songs: { connect: { id: relatedSongId } } },
						create: { ...artistData, songs: { connect: { id: relatedSongId } } },
					});
				}),
			);
			this.logger.info({ count: data.length }, "stored artist(s)");
		} catch (err) {
			this.logger.error({ err }, "failed to store artist(s) data");
			throw new ErrorRepository(err, this.type);
		}
	}

	async storeArtistLabels(artistId: string, artistName: string, genres: Genre[]): Promise<void> {
		try {
			this.logger.info({ artistId, artistName }, "storing artist labels");
			await this.client.artistGenreLabel.create({
				data: { artistId, labelledGenres: getGenres(genres) },
			});
			this.logger.info({ artistId, artistName }, "stored artist labels");
		} catch (err) {
			this.logger.error({ err, artistId, artistName }, "failed to store artist labels");
			throw new ErrorRepository(err, this.type);
		}
	}
}
