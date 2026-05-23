import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { SongDetailView } from "./components/SongDetailView";
import { SongList } from "./components/SongList";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SongList />} />
				<Route path="/songs/:id" element={<SongDetailView />} />
			</Routes>
		</BrowserRouter>
	);
}

const container = document.getElementById("root");
if (!container) throw new Error("missing #root");
createRoot(container).render(<App />);
