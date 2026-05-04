import type { SkipRequest } from "@heat/types";

export interface Storer {
	readonly storerType: string;
	upload(request: SkipRequest): Promise<void>;
}
