import type { ParsedResult, SkipRequest } from "@heat/types";

export interface Parser {
	readonly parserType: string;
	parse(request: SkipRequest): ParsedResult;
}
