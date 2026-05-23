export const CountChips = ({ values }: { values: { genre: string; count: number }[] }) => {
	if (values.length === 0) {
		return <span className="empty">No labels yet</span>;
	}

	return (
		<>
			{values.map((v) => (
				<span key={v.genre} className="chip">
					{v.genre} <span className="chip-count">×{v.count}</span>
				</span>
			))}
		</>
	);
};
