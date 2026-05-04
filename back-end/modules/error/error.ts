export abstract class AppError extends Error {
	abstract readonly errorType: string;

	constructor(message: string, cause: unknown) {
		super(message, { cause });
	}
}
