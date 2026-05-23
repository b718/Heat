import type { Artist, Song } from "@heat/types";
import { PrismaPg } from "@prisma/adapter-pg";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { PrismaClient } from "../generated/prisma/client";
import { getLogger } from "../logger/logger";

const logger = getLogger();
const client = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function loadJson<T>(dir: string): Promise<T[]> {
	const files = readdirSync(dir).filter((f) => f.endsWith(".json"));
	return Promise.all(files.map(async (f) => JSON.parse(await Bun.file(join(dir, f)).text()) as T));
}

async function seed() {
	const [artists, songs] = await Promise.all([
		loadJson<Artist>(join(import.meta.dir, "artists")),
		loadJson<Song>(join(import.meta.dir, "songs")),
	]);

	logger.info("uploading Artist data");
	await client.artist.createMany({
		data: artists.map((a) => ({
			id: a.id,
			name: a.name,
			genres: [],
		})),
	});

	logger.info("uploading Song data");
	for (const song of songs) {
		await client.song.create({
			data: {
				id: song.id,
				name: song.name,
				genres: [],
				artists: {
					connect: song.artists.map((id) => ({ id })),
				},
			},
		});
	}

	logger.info("uploading ArtistToArtist relations");
	await client.artistToArtist.createMany({
		data: artists.flatMap((a) =>
			a.relatedArtists.map((relatedId) => ({
				sourceArtistId: a.id,
				relatedArtistId: relatedId,
			})),
		),
	});

	logger.info("seed complete");
}

seed()
	.catch((err) => {
		logger.error(err, "seed failed");
		process.exit(1);
	})
	.finally(() => client.$disconnect());
