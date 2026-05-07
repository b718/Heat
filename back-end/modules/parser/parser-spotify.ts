import { PARSER_SPOTIFY_TYPE } from "@heat/consts";
import type {
	ArtistInformation,
	ParsedResult,
	SkipInformation,
	SkipRequest,
	SongInformation,
} from "@heat/types";

import type { Parser } from "./parser";

export class ParserSpotify implements Parser {
	readonly parserType = PARSER_SPOTIFY_TYPE;

	parse(request: SkipRequest): ParsedResult {
		return {
			song: this.parseSongInformation(request),
			artists: this.parseArtistInformation(request),
			skip: this.parseSkipInformation(request),
		};
	}

	private parseSongInformation(request: SkipRequest): SongInformation {
		return {
			id: request.songId,
			name: request.songName,
			genres: [] as string[],
		};
	}

	private parseArtistInformation(request: SkipRequest): ArtistInformation[] {
		return request.songArtists.map((songArtist) => {
			// "spotify:artist:20wkVLutqVOYrc0kxFs7rA", this is the format we are dealing with
			const artistId = songArtist.providerId.split(":").at(-1)!;
			return {
				id: artistId,
				name: songArtist.name,
				genres: [],
				relatedSongId: request.songId,
			};
		});
	}

	private parseSkipInformation(request: SkipRequest): SkipInformation {
		return {
			direction: request.direction,
			currentTime: request.currentTime,
			duration: request.duration,
			relatedSongId: request.songId,
		};
	}
}
