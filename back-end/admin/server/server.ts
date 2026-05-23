import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../generated/prisma/client";
import { getLogger } from "../../logger/logger";
import startServer from "../../server/server";
import { songDetail } from "../handlers/get/song-detail";
import { songs } from "../handlers/get/songs";
import { updateSongGenres } from "../handlers/put/update-song-genres";
import { SongRepositoryPrisma } from "../repositories/song-repository-prisma";

const prismaClient = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
const songRepository = new SongRepositoryPrisma(prismaClient, getLogger());

const app = startServer();
app.get("/api/songs", songs(songRepository));
app.get("/api/songs/:id", songDetail(songRepository));
app.put("/api/songs/:id/genres", updateSongGenres(songRepository));

export default app;
