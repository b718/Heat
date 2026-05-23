import { getLogger } from "../logger/logger";
import index from "./dashboard/index.html";
import app from "./server/server";

Bun.serve({
	hostname: "127.0.0.1",
	port: 3002,
	routes: {
		"/": index,
		"/songs/:id": index,
	},
	fetch: app.fetch,
	development: { hmr: true },
});

getLogger().info("Admin dashboard at http://127.0.0.1:3002");
