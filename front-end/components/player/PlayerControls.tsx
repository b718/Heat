"use client";

import { buildSkipRequest, skip } from "@/services/music-player";
import type { SpotifyPlayer, SpotifyPlayerState } from "@/types/spotify-sdk";
import { sliderGradient } from "@/utilities/slider";

interface Props {
	playerState: SpotifyPlayerState;
	volume: number;
	player: SpotifyPlayer | null;
	position: number;
	onVolumeChange: (v: number) => void;
}

export default function PlayerControls({
	playerState,
	volume,
	player,
	position,
	onVolumeChange,
}: Props) {
	const { paused, track_window } = playerState;
	const volumePercentage = volume * 100;
	const currentTrack = track_window.current_track;
	const hasPreviousTracks = track_window.previous_tracks.length > 0;
	const hasNextTracks = track_window.next_tracks.length > 0;

	return (
		<div className="flex w-full items-center gap-2">
			<button
				onClick={() => player?.togglePlay()}
				className="flex-1 rounded-full bg-green-500 py-2 text-sm font-bold hover:bg-green-400 transition-colors"
			>
				{paused ? "▶" : "⏸"}
			</button>
			<button
				disabled={!hasPreviousTracks}
				onClick={async () => {
					await player?.previousTrack();
					await skip(buildSkipRequest("backwards", currentTrack, position));
				}}
				className="rounded-full bg-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			>
				{"<<"}
			</button>
			<button
				disabled={!hasNextTracks}
				onClick={async () => {
					await player?.nextTrack();
					await skip(buildSkipRequest("forwards", currentTrack, position));
				}}
				className="rounded-full bg-zinc-700 px-4 py-2 text-sm font-bold hover:bg-zinc-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
			>
				{">>"}
			</button>
			<svg
				viewBox="0 0 16 16"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
				className="h-4 w-4 text-zinc-400 shrink-0"
			>
				<path
					d="M7.14645 1.85356C7.46143 1.53858 8 1.76167 8 2.20712V13.7929C8 14.2384 7.46143 14.4614 7.14645 14.1465L4 11H1.5C1.22386 11 1 10.7762 1 10.5V5.50001C1 5.22387 1.22386 5.00001 1.5 5.00001H4L7.14645 1.85356Z"
					fill="currentColor"
				/>
				<path
					d="M12 7.99999C12 9.48649 10.9189 10.7205 9.5 10.9585V5.04147C10.9189 5.27951 12 6.5135 12 7.99999Z"
					fill="currentColor"
				/>
			</svg>
			<input
				type="range"
				min={0}
				max={1}
				step={0.01}
				value={volume}
				onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
				className="slider w-24"
				style={{ background: sliderGradient(volumePercentage) }}
			/>
		</div>
	);
}
