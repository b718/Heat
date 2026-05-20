import { PARSER_SPOTIFY_TYPE } from "@heat/consts";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/prisma/client";
import { authCallback } from "./handlers/get/auth-callback";
import { authLogin } from "./handlers/get/auth-login";
import { authToken } from "./handlers/get/auth-token";
import { genres } from "./handlers/get/genres";
import { unlabelledItems } from "./handlers/get/unlabelled-items";
import { labelArtist } from "./handlers/post/label-artist";
import { labelSong } from "./handlers/post/label-song";
import { skip } from "./handlers/post/skip";
import { getLogger } from "./logger/logger";
import type { Parser } from "./modules/parser/parser";
import { ParserSpotify } from "./modules/parser/parser-spotify";
import { ArtistRepositoryPrisma } from "./modules/repositories/artist/artist-repository-prisma";
import { SkipRepositoryPrisma } from "./modules/repositories/skip/skip-repository-prisma";
import { SongRepositoryPrisma } from "./modules/repositories/song/song-repository-prisma";
import startServer from "./server/server";

async function main() {
	const app = startServer();
	const logger = getLogger();
	const prismaClient = new PrismaClient({
		adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
	});

	const artistRepository = new ArtistRepositoryPrisma(prismaClient, getLogger());
	const songRepository = new SongRepositoryPrisma(prismaClient, getLogger());
	const skipRepository = new SkipRepositoryPrisma(prismaClient, getLogger());
	const parserTypeToParser = new Map<string, Parser>([[PARSER_SPOTIFY_TYPE, new ParserSpotify()]]);

	app.get("/auth/login", authLogin);
	app.get("/auth/callback", authCallback);
	app.get("/auth/token", authToken);
	app.get("/genres", genres);
	app.get("/label/items", unlabelledItems(songRepository, artistRepository));

	app.post("/skip", skip(artistRepository, songRepository, skipRepository, parserTypeToParser));
	app.post("/label/song", labelSong(songRepository));
	app.post("/label/artist", labelArtist(artistRepository));

	Bun.serve({ port: 3001, fetch: app.fetch });
	logger.info("Back-end listening on http://localhost:3001");
}

main();
