import type { ParsedResult } from "@heat/types";

export interface Storer {
	readonly storerType: string;
	upload(result: ParsedResult): Promise<void>;
}
