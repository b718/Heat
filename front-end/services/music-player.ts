import { serverUrl, spotifyApiURL } from "@/consts/api";
import { SpotifyTrack } from "@/types/spotify-sdk";
import { PARSER_SPOTIFY_TYPE } from "@heat/consts";
import { ArtistQueryResponse, Direction, GetArtistResponse, SkipRequest } from "@heat/types";

export function buildSkipRequest(
	direction: Direction,
	currentTrack: SpotifyTrack,
	position: number,
): SkipRequest {
	return {
		direction,
		songId: currentTrack.id,
		songName: currentTrack.name,
		songArtists: currentTrack.artists.map(({ name, uri }) => ({ name, providerId: uri })),
		currentTime: position,
		duration: currentTrack.duration_ms,
		parserType: PARSER_SPOTIFY_TYPE,
	};
}

export async function skip(request: SkipRequest): Promise<void> {
	await fetch(`${serverUrl}/skip`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request),
	});
}

export async function playTrack(deviceId: string, trackId: string, token: string): Promise<void> {
	await fetch(`${spotifyApiURL}/v1/me/player/play?device_id=${deviceId}`, {
		method: "PUT",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
	});
}

export async function getArtist(artistId: string, token: string): Promise<GetArtistResponse> {
	const response = await fetch(`${spotifyApiURL}/v1/artists/${artistId}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	return await response.json();
}

export async function playArtistTopTrack(
	deviceId: string,
	artistName: string,
	token: string,
): Promise<void> {
	const queryParams = new URLSearchParams({
		q: artistName,
		type: "track",
		limit: "1",
	});
	const response = await fetch(`${spotifyApiURL}/v1/search?${queryParams.toString()}`, {
		headers: { Authorization: `Bearer ${token}` },
	});
	const deserializedResponse: ArtistQueryResponse = await response.json();
	const trackId = deserializedResponse.tracks.items.at(0)?.id;
	if (!trackId) throw new Error("unable to load artist data");

	await playTrack(deviceId, trackId, token);
}
