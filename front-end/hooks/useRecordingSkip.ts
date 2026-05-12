"use client";

import { useState } from "react";

import { buildSkipRequest, skip } from "@/services/music-player";
import type { SpotifyTrack } from "@/types/spotify-sdk";
import type { Direction } from "@heat/types";

export function useRecordingSkip() {
	const [submitting, setSubmitting] = useState(false);
	const [failedAttempts, setFailedAttempts] = useState(0);

	async function submit(direction: Direction, currentTrack: SpotifyTrack, position: number) {
		setSubmitting(true);
		try {
			await skip(buildSkipRequest(direction, currentTrack, position));
			setFailedAttempts(0);
		} catch (err) {
			setFailedAttempts((n) => n + 1);
			throw err;
		} finally {
			setSubmitting(false);
		}
	}

	function reset() {
		setFailedAttempts(0);
	}

	return { submitting, failedAttempts, submit, reset };
}
