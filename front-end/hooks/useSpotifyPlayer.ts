"use client";

import { useEffect, useRef, useState } from "react";

import { loadPlaylist } from "@/services/music-player";
import type { SpotifyPlayer, SpotifyPlayerState } from "@/types/spotify-sdk";

export function useSpotifyPlayer(token: string) {
	const playerRef = useRef<SpotifyPlayer | null>(null);
	const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: "Heat (Playback)",
				getOAuthToken: (cb) => cb(token),
				volume: 0,
			});
			player.addListener("initialization_error", ({ message }) => setError(message));
			player.addListener("authentication_error", ({ message }) => setError(message));
			player.addListener("player_state_changed", (state) => setPlayerState(state));
			player.addListener("ready", async ({ device_id: deviceId }) => {
				await loadPlaylist(deviceId, token);
				setLoading(false);
			});
			player.connect().then((success) => {
				if (!success) {
					setError("Failed to connect to Spotify.");
					setLoading(false);
				}
			});
			playerRef.current = player;
		};

		if (!document.getElementById("spotify-sdk")) {
			const script = document.createElement("script");
			script.id = "spotify-sdk";
			script.src = "https://sdk.scdn.co/spotify-player.js";
			script.async = true;
			document.body.appendChild(script);
		} else if (window.Spotify) {
			window.onSpotifyWebPlaybackSDKReady();
		}

		return () => {
			playerRef.current?.disconnect();
		};
	}, [token]);

	return { playerRef, playerState, loading, error };
}
