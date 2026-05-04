<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## Styling

- If components are needed, make a seperate folder for it called `components` at the root directory level.
- If utilities are needed, make a seperate folder for it called `utilities` at the root directory level.
- If a component has loading and/or error components, make a `useState` hook for each and create a display for the loading and error states.
- If API calls are needed, create a `services/` folder at the root directory level. Split service files by domain (e.g. `auth.ts`, `player.ts`) — never put all calls in one file.
- Always use `response` instead of `res` when naming API responses.
