import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { fetchSongs } from "../../services/songs";
import type { SongListItem } from "../../types/types";
import { Chips } from "./Chips";

export const SongList = () => {
	const [rows, setRows] = useState<SongListItem[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		fetchSongs()
			.then((data) => setRows(data))
			.catch((err: Error) => setError(err.message));
	}, []);

	if (error) {
		return <p>Failed to load: {error}</p>;
	}

	if (rows === null) {
		return <p>Loading…</p>;
	}

	return (
		<>
			<h1>Songs</h1>
			<p className="meta">{rows.length} songs · ordered by name</p>
			<table>
				<thead>
					<tr>
						<th>Song</th>
						<th>Artists</th>
						<th>Genres</th>
						<th>Labels</th>
					</tr>
				</thead>
				<tbody>
					{rows.map((row) => (
						<tr key={row.id} className="row-link">
							<td>
								<Link to={`/songs/${row.id}`}>{row.name}</Link>
							</td>
							<td>{row.artists.map((a) => a.name).join(", ")}</td>
							<td>
								<Chips values={row.genres} />
							</td>
							<td>{row.labelCount}</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	);
};
