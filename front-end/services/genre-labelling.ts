import { serverUrl } from "@/consts/api";
import type { Genres, LabelArtistRequest, LabelSongRequest, UnlabelledItemsResponse } from "@heat/types";

export async function fetchGenres(): Promise<Genres> {
	const response = await fetch(`${serverUrl}/genres`);
	if (!response.ok) throw new Error(`Request failed: ${response.status}`);
	return response.json();
}

export async function fetchLabelItems(): Promise<UnlabelledItemsResponse> {
	const response = await fetch(`${serverUrl}/label/items`);
	if (!response.ok) throw new Error(`Request failed: ${response.status}`);
	return response.json();
}

export async function labelSong(request: LabelSongRequest): Promise<void> {
	const response = await fetch(`${serverUrl}/label/song`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request),
	});
	if (!response.ok) throw new Error(`Request failed: ${response.status}`);
}

export async function labelArtist(request: LabelArtistRequest): Promise<void> {
	const response = await fetch(`${serverUrl}/label/artist`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(request),
	});
	if (!response.ok) throw new Error(`Request failed: ${response.status}`);
}
