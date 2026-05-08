import type { Artist, Song } from "@heat/types";

import artistNames from "./meta-data/artist-names.json";
import { ACCESS_TOKEN } from "./meta-data/const";

interface QueryResponse {
	tracks: {
		items: {
			id: string;
			name: string;
		}[];
	};
	artists: {
		items: {
			id: string;
			name: string;
		}[];
	};
}

async function main() {
	const QUERY_API_ENDPOINT = "https://api.spotify.com/v1/search";
	const queryInformation = await Promise.all(
		artistNames.names.map(async (artistName) => {
			const response = await fetch(
				`${QUERY_API_ENDPOINT}?q=${encodeURI(artistName)}&type=artist%2Ctrack`,
				{
					headers: {
						Authorization: `Bearer ${ACCESS_TOKEN}`,
					},
				},
			);
			return (await response.json()) as QueryResponse;
		}),
	);

	const artistObjects: Artist[] = [];
	queryInformation.forEach((query, index) => {
		const song: Song = {
			id: query.tracks.items[0]?.id!,
			name: query.tracks.items[0]?.name!,
			genres: [],
			artists: [query.artists.items[0]?.id!],
		};
		const artist: Artist = {
			id: query.artists.items[0]?.id!,
			name: query.artists.items[0]?.name!,
			genres: [],
			relatedArtists: [],
		};
		Bun.write(
			`../data/bad-data/song/${index}-${song.name.replace("/", "").split(" ").join("-").toLowerCase()}.json`,
			JSON.stringify(song, null, 2),
		);
		artistObjects.push(artist);
	});

	const [
		diggaObject,
		centralCeeObject,
		esdeekidObject,
		isoxoObject,
		knock2Object,
		isoknockObject,
		kingVonObject,
		lilDurkObject,
		lilBabyObject,
		youngThugObject,
		twentyOneSavageObject,
	] = artistObjects;

	// Connect the artists together
	diggaObject!.relatedArtists = [centralCeeObject!.id, kingVonObject!.id];
	centralCeeObject!.relatedArtists = [];
	esdeekidObject!.relatedArtists = [];
	isoxoObject!.relatedArtists = [knock2Object!.id, isoknockObject!.id];
	knock2Object!.relatedArtists = [isoxoObject!.id, isoknockObject!.id];
	isoknockObject!.relatedArtists = [isoxoObject!.id, knock2Object!.id];
	kingVonObject!.relatedArtists = [diggaObject!.id, lilDurkObject!.id];
	lilDurkObject!.relatedArtists = [kingVonObject!.id];
	lilBabyObject!.relatedArtists = [kingVonObject!.id, youngThugObject!.id, twentyOneSavageObject!.id];
	youngThugObject!.relatedArtists = [lilBabyObject!.id, twentyOneSavageObject!.id];
	twentyOneSavageObject!.relatedArtists = [lilBabyObject!.id, youngThugObject!.id];
	artistObjects.forEach((artistObject, index) =>
		Bun.write(
			`../data/bad-data/artist/${index}-${artistObject.name.split(" ").join("-").toLowerCase()}.json`,
			JSON.stringify(artistObject, null, 2),
		),
	);
}

main();
