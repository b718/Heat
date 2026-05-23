# Heat Admin Dashboard (POC)

Read-only browser for inspecting the database — currently a single table view of `SongGenreLabel` joined with its `Song` (name, genres) and the song's `Artist`s.

## Running

```sh
just admin
# or
bun run admin
```

Then open <http://127.0.0.1:3002>.

## Safety

- Binds to `127.0.0.1:3002` — not reachable from the LAN or internet.
- Refuses to start when `NODE_ENV === "production"`.
- **Never deploy this.** No Docker target, no CI, no auth.

To inspect production data, set `DATABASE_URL` to your production connection string in `back-end/.env` before running (and switch it back afterwards).
