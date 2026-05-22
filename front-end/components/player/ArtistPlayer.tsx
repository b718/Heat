"use client";

import { RefObject, useState } from "react";

import { LabelItem } from "@/hooks/useGenreLabelling";
import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";
import { useToken } from "@/hooks/useToken";
import { getArtist } from "@/services/music-player";
import type { SpotifyPlayer, SpotifyPlayerState } from "@/types/spotify-sdk";
import { GetArtistResponse } from "@heat/types";
import useSWR from "swr";

import PlayerControls from "./PlayerControls";
import PlayerDuration from "./PlayerDuration";

interface Props {
	deviceId: string | null;
	currentItem: LabelItem;
	playerRef: RefObject<SpotifyPlayer | null>;
	playerState: SpotifyPlayerState | null;
	position: number;
	setPosition: (value: number | ((prev: number) => number)) => void;
}

export default function ArtistPlayer({
	deviceId,
	currentItem,
	playerRef,
	playerState,
	position,
	setPosition,
}: Props) {
	const artistId = currentItem.data.id;
	const [volume, setVolume] = useState(0.5);
	const { data: token } = useToken();
	const {
		data: artistInfo,
		error: artistError,
		isLoading: artistLoading,
	} = useSWR<GetArtistResponse, Error, [string, string] | null>(
		token ? [artistId, token] : null,
		([artistId, token]) => getArtist(artistId, token),
	);
	const { error, loading } = useSpotifyPlayback({ currentItem, deviceId });

	async function handleSeek(ms: number) {
		setPosition(ms);
		await playerRef.current?.seek(ms);
	}

	async function handleVolumeChange(v: number) {
		setVolume(v);
		await playerRef.current?.setVolume(v);
	}

	if (!playerState) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-full max-w-3xl mt-4">
				<p className="text-zinc-400 text-sm text-center">
					Open Spotify and transfer playback to '{"Heat (Playback)"}'
				</p>
			</div>
		);
	}

	if (artistLoading || loading) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-full max-w-3xl mt-4">
				<p className="text-zinc-400 text-sm text-center">Loading artist...</p>
			</div>
		);
	}

	if (artistError || !artistInfo || error) {
		return (
			<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-full max-w-3xl mt-4">
				<p className="text-red-400 text-sm text-center">{error ?? "Failed to load artist."}</p>
			</div>
		);
	}

	const currentTrack = playerState.track_window.current_track;

	return (
		<div className="rounded-xl px-6 py-5 flex flex-col items-center gap-4 w-full max-w-3xl mt-4">
			<ArtistArt artist={artistInfo} />
			<ArtistDescription artist={artistInfo} />
			<PlayerDuration position={position} durationMs={currentTrack.duration_ms} onSeek={handleSeek} />
			<PlayerControls
				playerState={playerState}
				volume={volume}
				player={playerRef.current}
				position={position}
				onVolumeChange={handleVolumeChange}
			/>
		</div>
	);
}

function ArtistArt({ artist }: { artist: GetArtistResponse }) {
	return (
		<img
			src={artist.images.at(0)?.url}
			alt={artist.name}
			width={240}
			height={240}
			className="rounded-lg shadow-2xl"
		/>
	);
}

function ArtistDescription({ artist }: { artist: GetArtistResponse }) {
	return (
		<div className="w-full text-center">
			<p className="text-xl font-semibold">{artist.name}</p>
		</div>
	);
}
