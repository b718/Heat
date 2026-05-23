import type { Logger } from "pino";

import type { PrismaClient } from "../../generated/prisma/client";
import { ErrorRepository } from "../../modules/error/error-repository";
import type { SongDetail, SongListItem } from "../types/types";
import type { SongRepository } from "./song-repository";

export class SongRepositoryPrisma implements SongRepository {
	readonly type = "admin-song-repository-prisma";

	private readonly client: PrismaClient;
	private readonly logger: Logger;

	constructor(client: PrismaClient, logger: Logger) {
		this.client = client;
		this.logger = logger.child({ name: __filename, nametype: this.type });
	}

	async fetchAllSongs(): Promise<SongListItem[]> {
		try {
			this.logger.info("fetching all songs");
			const songs = await this.client.song.findMany({
				include: {
					artists: { select: { id: true, name: true } },
					_count: { select: { songGenreLabels: true } },
				},
				orderBy: { songGenreLabels: { _count: "desc" } },
			});
			this.logger.info({ count: songs.length }, "fetched all songs");
			return songs.map((song) => ({
				id: song.id,
				name: song.name,
				genres: song.genres,
				artists: song.artists,
				labelCount: song._count.songGenreLabels,
			}));
		} catch (err) {
			this.logger.error({ err }, "failed to fetch all songs");
			throw new ErrorRepository(err, this.type);
		}
	}

	async fetchSongDetail(songId: string): Promise<SongDetail | null> {
		try {
			this.logger.info({ songId }, "fetching song detail");
			const song = await this.client.song.findUnique({
				where: { id: songId },
				include: {
					artists: { select: { id: true, name: true } },
					songGenreLabels: {
						select: { id: true, labelledGenres: true, createdAt: true },
						orderBy: { createdAt: "desc" },
					},
				},
			});
			if (song === null) {
				this.logger.info({ songId }, "song not found");
				return null;
			}

			const counts = new Map<string, number>();
			for (const label of song.songGenreLabels) {
				for (const genre of label.labelledGenres) {
					counts.set(genre, (counts.get(genre) ?? 0) + 1);
				}
			}
			const predictedLabels = Array.from(counts, ([genre, count]) => ({ genre, count })).sort(
				(a, b) => b.count - a.count,
			);

			this.logger.info({ songId, predictedLabelCount: predictedLabels.length }, "fetched song detail");
			return {
				id: song.id,
				name: song.name,
				genres: song.genres,
				artists: song.artists,
				predictedLabels,
				labels: song.songGenreLabels.map((label) => ({
					id: label.id,
					labelledGenres: label.labelledGenres,
					createdAt: label.createdAt.toISOString(),
				})),
			};
		} catch (err) {
			this.logger.error({ err, songId }, "failed to fetch song detail");
			throw new ErrorRepository(err, this.type);
		}
	}

	async updateSongGenres(songId: string, genres: string[]): Promise<boolean> {
		try {
			this.logger.info({ songId, genreCount: genres.length, genres }, "updating song genres");
			await this.client.song.update({ where: { id: songId }, data: { genres } });

			this.logger.info({ songId, genreCount: genres.length }, "updated song genres");
			return true;
		} catch (err) {
			this.logger.error({ err, songId }, "failed to update song genres");
			throw new ErrorRepository(err, this.type);
		}
	}
}
