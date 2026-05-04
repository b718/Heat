import { AppError } from "./error";

export class ErrorStorer extends AppError {
	readonly errorType = "storer";

	constructor(causeOfError: unknown) {
		super("storer failed", causeOfError);
	}
}
