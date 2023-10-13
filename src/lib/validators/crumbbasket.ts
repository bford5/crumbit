import { z } from "zod";

export const CrumbbasketValidator = z.object({
	name: z.string().min(3).max(21),
});

export const CrumbbasketSubscriptionValidator = z.object({
	crumbbasketId: z.string(),
});

export type CreateCrumbbasketPayload = z.infer<typeof CrumbbasketValidator>;
export type SubscribeToCrumbbasketPayload = z.infer<
	typeof CrumbbasketSubscriptionValidator
>;
