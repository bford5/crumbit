// ie: a user post to a community

import { z } from "zod";

export const crumbValidator = z.object({
	title: z
		.string()
		.min(3, { message: "title needs to be longer than 3 characters" })
		.max(128, { message: "title needs to be less than 128 characters" }),
	crumbbasketId: z.string(),
	content: z.any(),
	// using .any for ease to capture all editor content easily
});

export type crumbCreationRequest = z.infer<typeof crumbValidator>;
