import type { SkipRequest } from "@heat/types";
import type { Context } from "hono";

import { getLogger } from "../../logger/logger";
import type { Parser } from "../../modules/parser/parser";
import type { Storer } from "../../modules/storer/storer";

const logger = getLogger();

export function skip(storer: Storer, parserTypeToParser: Map<string, Parser>) {
	return async function (c: Context) {
		try {
			const body: SkipRequest = await c.req.json();
			logger.info(
				{ direction: body.direction, songId: body.songId, songName: body.songName },
				"track skipped",
			);
			const parsedData = getParser(body.parserType, parserTypeToParser).parse(body);
			await storer.store(parsedData);
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
