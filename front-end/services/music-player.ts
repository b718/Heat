import { serverUrl, spotifyApiURL } from "@/consts/api";
import { Directon } from "@heat/types";

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
		uris: ["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:track:1301WleyT98MSxVHPZCA6M"],
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
