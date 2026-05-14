"use client";

import { useEffect, useRef, useState } from "react";

import type { SpotifyPlayer, SpotifyPlayerState } from "@/types/spotify-sdk";

import { useToken } from "./useToken";

export function useSpotifyPlayer() {
	const { data: token } = useToken();
	const playerRef = useRef<SpotifyPlayer | null>(null);
	const [playerState, setPlayerState] = useState<SpotifyPlayerState | null>(null);
	const [deviceId, setDeviceId] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: "Heat (Playback)",
				getOAuthToken: (cb) => cb(token),
				volume: 0.5,
			});
			player.addListener("initialization_error", ({ message }) => setError(message));
			player.addListener("authentication_error", ({ message }) => setError(message));
			player.addListener("player_state_changed", (state) => setPlayerState(state));
			player.addListener("ready", ({ device_id }) => {
				setDeviceId(device_id);
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
	}, []);

	return { playerRef, deviceId, playerState, loading, error };
}
