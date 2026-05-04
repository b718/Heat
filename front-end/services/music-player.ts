import { serverUrl, spotifyApiURL } from "@/consts/api";
import { SpotifyTrack } from "@/types/spotify-sdk";
import { Directon, SkipRequest } from "@heat/types";

import Playlist from "./data/playlist.json";

export function buildSkipRequest(
	direction: Directon,
	currentTrack: SpotifyTrack,
	position: number,
): SkipRequest {
	return {
		direction,
		songId: currentTrack.id,
		songName: currentTrack.name,
		songArtists: currentTrack.artists,
		currentTime: position,
		duration: currentTrack.duration_ms,
	};
}

export async function skip(request: SkipRequest): Promise<void> {
	await fetch(`${serverUrl}/skip`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request),
	});
}

export async function loadPlaylist(deviceId: string, token: string): Promise<void> {
	const playlist = {
		//this is from spotify
		uris: Playlist.songUris,
		position_ms: 0,
	};
	await fetch(`${spotifyApiURL}/v1/me/player/play?device_id=${deviceId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		method: "PUT",
		body: JSON.stringify(playlist),
	});
}
