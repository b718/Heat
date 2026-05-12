import type { ParsedResult, SkipRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { Parser } from "../../modules/parser/parser";
import type { ArtistRepository } from "../../modules/repositories/artist/artist-repository";
import type { SkipRepository } from "../../modules/repositories/skip/skip-repository";
import type { SongRepository } from "../../modules/repositories/song/song-repository";

const logger = getLogger();

export function skip(
	artistRepository: ArtistRepository,
	songRepository: SongRepository,
	skipRepository: SkipRepository,
	parserTypeToParser: Map<string, Parser>,
) {
	return async function (c: Context) {
		try {
			const body: SkipRequest = await c.req.json();
			logger.info(
				{ direction: body.direction, songId: body.songId, songName: body.songName },
				"track skipped",
			);
			const parsedData = getParser(body.parserType, parserTypeToParser).parse(body);
			await storeSkipRequest(parsedData, artistRepository, songRepository, skipRepository);
			return c.json({ ok: true });
		} catch (err) {
			logger.error({ err }, "failed to handle skip request");
			return c.json({ ok: false }, 500);
		}
	};
}

function getParser(parserType: string, parserTypeToParser: Map<string, Parser>): Parser {
	const parser = parserTypeToParser.get(parserType);
	if (!parser) {
		throw new Error(`Unknown parserType: ${parserType}`);
	}

	return parser;
}

async function storeSkipRequest(
	data: ParsedResult,
	artistRepository: ArtistRepository,
	songRepository: SongRepository,
	skipRepository: SkipRepository,
) {
	try {
		logger.info({ songId: data.song.id, songName: data.song.name }, "storing skip request");
		await songRepository.storeSong(data.song);
		await artistRepository.storeArtists(data.artists);
		await skipRepository.store(data.skip);
		logger.info({ songId: data.song.id, songName: data.song.name }, "stored skip request");
	} catch (err) {
		logger.error(
			{ err, songId: data.song.id, songName: data.song.name },
			"failed to store skip request",
		);
		throw err;
	}
}
