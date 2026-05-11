import type { SkipInformation } from "@heat/types";
import type { Logger } from "pino";

import type { PrismaClient } from "../../../generated/prisma/client";
import { ErrorRepository } from "../../error/error-repository";
import type { SkipRepository } from "./skip-repository";

export class SkipRepositoryPrisma implements SkipRepository {
	readonly type = "skip-repository-prisma";

	private readonly client: PrismaClient;
	private readonly logger: Logger;

	constructor(client: PrismaClient, logger: Logger) {
		this.client = client;
		this.logger = logger.child({ name: __filename, skipRepositoryType: this.type });
	}

	async store(data: SkipInformation): Promise<void> {
		try {
			const { relatedSongId, ...skipData } = data;
			this.logger.info({ songId: data.relatedSongId, direction: data.direction }, "storing skip");
			await this.client.skip.create({
				data: {
					...skipData,
					song: {
						connect: { id: relatedSongId },
					},
				},
			});
			this.logger.info({ songId: data.relatedSongId, direction: data.direction }, "stored skip");
		} catch (err) {
			this.logger.error({ err, songId: data.relatedSongId }, "failed to store skip data");
			throw new ErrorRepository(err, this.type);
		}
	}
}
