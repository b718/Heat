"use client";

import { sliderGradient } from "@/utilities/slider";

interface Props {
	position: number;
	durationMs: number;
	onSeek: (ms: number) => void;
}

export default function PlayerDuration({ position, durationMs, onSeek }: Props) {
	const progressPercentage = (position / durationMs) * 100;
	return (
		<div className="flex w-full flex-col gap-1">
			<input
				type="range"
				min={0}
				max={durationMs}
				value={position}
				onChange={(e) => onSeek(parseInt(e.target.value))}
				className="slider w-full"
				style={{ background: sliderGradient(progressPercentage) }}
			/>
			<div className="flex justify-between text-xs text-zinc-400">
				<span>{formatDuration(position)}</span>
				<span>{formatDuration(durationMs)}</span>
			</div>
		</div>
	);
}

function formatDuration(ms: number): string {
	const totalSec = Math.floor(ms / 1000);
	const min = Math.floor(totalSec / 60);
	const sec = (totalSec % 60).toString().padStart(2, "0");
	return `${min}:${sec}`;
}
