import { serverUrl, spotifyApiURL } from "@/consts/api";
import { Directon } from "@heat/types";

import Playlist from "./data/playlist.json";

export async function skip(direction: Directon): Promise<void> {
	await fetch(`${serverUrl}/skip`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ direction }),
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
