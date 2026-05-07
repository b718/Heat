import type { ParsedResult } from "@heat/types";

export interface Storer {
	readonly storerType: string;
	store(result: ParsedResult): Promise<void>;
}
