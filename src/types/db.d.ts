import { Comment, Crumbbasket, Post, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
	crumbbasket: Crumbbasket;
	votes: Vote[];
	author: User;
	comments: Comment[];
};
