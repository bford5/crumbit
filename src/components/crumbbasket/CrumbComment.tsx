"use client";

import { FC, useRef } from "react";
import UserAvatar from "../UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";

type ExtendedComment = Comment & {
	votes: CommentVote[];
	author: User;
};

interface CrumbCommentProps {
	comment: ExtendedComment;
	votesAmount: number;
	currentVote: CommentVote | undefined;
	crumbId: string;
}

const CrumbComment: FC<CrumbCommentProps> = ({
	comment,
	votesAmount,
	currentVote,
	crumbId,
}) => {
	const commentRef = useRef<HTMLDivElement>(null);

	return (
		<div className='flex flex-col p-2' ref={commentRef}>
			<div className='flex items-center'>
				<UserAvatar
					user={{
						name: comment.author.name || null,
						image: comment.author.image || null,
					}}
					className='h-6 w-6'
				/>

				<div className='ml-2 flex items-center gap-x-2'>
					<p className='text-sm font-medium text-text-darkMode'>
						u/{comment.author.username}
					</p>
					<p className='mx-h-40 truncate text-xs text-text-darkMode'>
						{formatTimeToNow(new Date(comment.createdAt))}
					</p>
				</div>
			</div>

			<p className='text-sm text-text-darkMode mt-2'>
				{comment.commentContent}
			</p>
			<div className='flex gap-2 items-center'>
				<CommentVotes
					commentId={comment.id}
					initialVotesAmount={votesAmount}
					initialVote={currentVote}
				/>
			</div>
		</div>
	);
};

export default CrumbComment;