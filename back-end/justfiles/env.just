# Create .env from .env.example if it doesn't already exist
setup:
    @cd .. && bun justfiles/setup-env.ts
