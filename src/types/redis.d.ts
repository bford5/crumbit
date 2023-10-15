import { Vote, VoteType } from "@prisma/client";

export type CachedPostPayload = {
	id: string;
	title: string;
	authorUsername: string;
	content: string;
	// currentVote: Vote['type']
	currentVote: VoteType | null;
	createdAt: Date;
};
