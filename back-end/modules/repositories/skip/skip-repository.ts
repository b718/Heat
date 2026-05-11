import type { SkipInformation } from "@heat/types";

export interface SkipRepository {
	readonly type: string;

	store(data: SkipInformation): Promise<void>;
}
