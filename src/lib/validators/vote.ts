import { z } from "zod";

export const CrumbVoteValidator = z.object({
	postId: z.string(),
	voteType: z.enum(["UP", "DOWN"]),
});

export type CrumbVoteRequest = z.infer<typeof CrumbVoteValidator>;

export const CrumbCommentVoteValidator = z.object({
	// crumbId: z.string(),
	crumbCommentId: z.string(),
	voteType: z.enum(["UP", "DOWN"]),
});

export type CrumCommentVoteRequest = z.infer<typeof CrumbCommentVoteValidator>;
