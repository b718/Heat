import { AppError } from "./error";

export class ErrorRepository extends AppError {
	constructor(causeOfError: unknown, repositoryType: string) {
		super(`${repositoryType} failed`, causeOfError);
	}
}
