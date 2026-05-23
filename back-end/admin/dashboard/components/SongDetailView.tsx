import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import { GENRE_OPTIONS } from "../../consts/genres";
import { fetchSongDetail, updateSongGenres } from "../../services/songs";
import type { SongDetail } from "../../types/types";
import { Chips } from "./Chips";
import { CountChips } from "./CountChips";

export const SongDetailView = () => {
	const { id } = useParams<{ id: string }>();
	const [detail, setDetail] = useState<SongDetail | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [isEditingGenres, setIsEditingGenres] = useState(false);
	const [draftGenres, setDraftGenres] = useState<string[]>([]);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setDetail(null);
		setError(null);
		setIsEditingGenres(false);
		setSaveError(null);
		fetchSongDetail(id)
			.then((data) => setDetail(data))
			.catch((err: Error) => setError(err.message));
	}, [id]);

	if (error) {
		return (
			<>
				<Link to="/" className="back-link">
					Back to songs
				</Link>
				<p>Failed to load: {error}</p>
			</>
		);
	}

	if (detail === null) {
		return (
			<>
				<Link to="/" className="back-link">
					Back to songs
				</Link>
				<p>Loading…</p>
			</>
		);
	}

	const startEditingGenres = () => {
		if (!detail) return;
		setDraftGenres(detail.genres);
		setSaveError(null);
		setIsEditingGenres(true);
	};

	const cancelEditingGenres = () => {
		setIsEditingGenres(false);
		setSaveError(null);
	};

	const toggleDraftGenre = (genre: string) => {
		setDraftGenres((prev) =>
			prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
		);
	};

	async function saveGenres() {
		if (!detail) return;
		setSaving(true);
		setSaveError(null);
		try {
			await updateSongGenres(detail.id, draftGenres);
			setDetail({ ...detail, genres: draftGenres });
			setIsEditingGenres(false);
		} catch (err) {
			setSaveError((err as Error).message);
		} finally {
			setSaving(false);
		}
	}

	const predictedSet = new Set(detail.predictedLabels.map((p) => p.genre));
	const predictedOptions = detail.predictedLabels
		.map((p) => p.genre)
		.filter((g) => GENRE_OPTIONS.includes(g));
	const otherOptions = GENRE_OPTIONS.filter((g) => !predictedSet.has(g));
	const renderGenreOption = (genre: string) => (
		<li key={genre}>
			<label>
				<input
					type="checkbox"
					checked={draftGenres.includes(genre)}
					onChange={() => toggleDraftGenre(genre)}
					disabled={saving}
				/>
				{genre}
			</label>
		</li>
	);

	return (
		<>
			<Link to="/" className="back-link">
				Back to songs
			</Link>
			<h1>{detail.name}</h1>
			<section className="detail-section">
				<h2>Artists</h2>
				<p>
					{detail.artists.length === 0 ? (
						<span className="empty">—</span>
					) : (
						detail.artists.map((a) => a.name).join(", ")
					)}
				</p>
			</section>
			<section className="detail-section">
				<div className="section-heading">
					<h2>Song genres</h2>
					{!isEditingGenres && (
						<button type="button" className="text-button" onClick={startEditingGenres}>
							Edit
						</button>
					)}
				</div>
				{isEditingGenres ? (
					<div>
						<p className="genre-group-heading">Predicted by people</p>
						{predictedOptions.length === 0 ? (
							<p className="empty">None</p>
						) : (
							<ul className="genre-options">{predictedOptions.map(renderGenreOption)}</ul>
						)}
						<p className="genre-group-heading">Other</p>
						<ul className="genre-options">{otherOptions.map(renderGenreOption)}</ul>
						{saveError && <p className="error">Failed to save: {saveError}</p>}
						<div className="edit-actions">
							<button type="button" onClick={saveGenres} disabled={saving}>
								{saving ? "Saving…" : "Save"}
							</button>
							<button
								type="button"
								className="text-button"
								onClick={cancelEditingGenres}
								disabled={saving}
							>
								Cancel
							</button>
						</div>
					</div>
				) : (
					<div>
						<Chips values={detail.genres} />
					</div>
				)}
			</section>
			<section className="detail-section">
				<h2>Top predicted labels</h2>
				<p className="meta">
					Aggregated across {detail.predictedLabels.reduce((a, b) => a + b.count, 0)} label entries
				</p>
				<div>
					<CountChips values={detail.predictedLabels} />
				</div>
			</section>
			<section className="detail-section">
				<h2>SongGenreLabel rows</h2>
				<p className="meta">{detail.labels.length} rows · ordered by createdAt desc</p>
				{detail.labels.length === 0 ? (
					<span className="empty">No label entries yet</span>
				) : (
					<table>
						<thead>
							<tr>
								<th>ID</th>
								<th>Labelled genres</th>
								<th>Created</th>
							</tr>
						</thead>
						<tbody>
							{detail.labels.map((label) => (
								<tr key={label.id}>
									<td>
										<code>{label.id}</code>
									</td>
									<td>
										<Chips values={label.labelledGenres} />
									</td>
									<td>{new Date(label.createdAt).toLocaleString()}</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</section>
		</>
	);
};
