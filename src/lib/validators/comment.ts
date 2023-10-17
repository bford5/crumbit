import { z } from "zod";

export const CommentValidator = z.object({
	crumbId: z.string(),
	commentContent: z.string(),
	replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
