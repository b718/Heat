const envFile = Bun.file(".env");
const exampleFile = Bun.file(".env.example");

if (await envFile.exists()) {
	console.log(".env already exists, leaving it alone.");
	process.exit(0);
}

if (!(await exampleFile.exists())) {
	console.error(".env.example is missing — cannot create .env.");
	process.exit(1);
}

await Bun.write(".env", await exampleFile.text());
console.log("Created .env from .env.example — fill in the blank values before running the app.");
