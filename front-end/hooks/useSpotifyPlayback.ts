import { useEffect, useState } from "react";

import { playArtistTopTrack, playTrack } from "@/services/music-player";

import { LabelItem } from "./useGenreLabelling";
import { useToken } from "./useToken";

interface Props {
	currentItem: LabelItem;
	deviceId: string | null;
}
export function useSpotifyPlayback({ currentItem, deviceId }: Props) {
	const { data: token } = useToken();
	const [error, setError] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!deviceId) return;

		setLoading(true);
		const request =
			currentItem.type === "song"
				? playTrack(deviceId, currentItem.data.id, token)
				: playArtistTopTrack(deviceId, currentItem.data.name, token);
		request
			.catch(() => {
				const errorMessage =
					currentItem.type === "song" ? "error loading song" : "error loading artist's top track";
				setError(errorMessage);
			})
			.finally(() => setLoading(false));
	}, [currentItem, deviceId]);

	return { error, loading };
}
