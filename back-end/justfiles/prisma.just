migrate:
    @cd .. && bunx --bun prisma migrate dev
    @just prisma::generate

generate:
    @cd .. && bunx --bun prisma generate