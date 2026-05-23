export const Chips = ({ values }: { values: string[] }) => {
	if (values.length === 0) {
		return <span className="empty">—</span>;
	}

	return (
		<>
			{values.map((v) => (
				<span key={v} className="chip">
					{v}
				</span>
			))}
		</>
	);
};
