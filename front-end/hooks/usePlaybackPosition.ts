"use client";

import { useEffect, useState } from "react";

import type { SpotifyPlayerState } from "@/types/spotify-sdk";

export function usePlaybackPosition(playerState: SpotifyPlayerState | null) {
	const [position, setPosition] = useState(0);

	useEffect(() => {
		if (!playerState) return;
		setPosition(playerState.position);
		if (playerState.paused) return;
		const interval = setInterval(() => setPosition((prev) => prev + 1000), 1000);
		return () => clearInterval(interval);
	}, [playerState]);

	return { position, setPosition };
}
