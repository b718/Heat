export abstract class AppError extends Error {
	constructor(message: string, cause: unknown) {
		super(message, { cause });
	}
}
