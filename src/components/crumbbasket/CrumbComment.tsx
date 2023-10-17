"use client";

import { FC, useRef, useState } from "react";
import UserAvatar from "../UserAvatar";
import { Comment, CommentVote, User } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios from "axios";

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

	const router = useRouter();
	const { data: session } = useSession();

	const [isReplying, setIsReplying] = useState<boolean>(false);
	const [commentInput, setCommentInput] = useState<string>("");

	const { mutate: createCrumbCommentReply, isLoading } = useMutation({
		mutationFn: async ({
			commentContent,
			crumbId,
			replyToId,
		}: CommentRequest) => {
			const payload: CommentRequest = {
				commentContent,
				crumbId,
				replyToId,
			};

			const { data } = await axios.patch(
				`/api/crumbbasket/crumb/comment`,
				payload
			);
			return data;
		},
	});

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
			<div className='flex gap-2 items-center justify-between flex-wrap'>
				<CommentVotes
					commentId={comment.id}
					initialVotesAmount={votesAmount}
					initialVote={currentVote}
				/>
				<Button
					onClick={() => {
						if (!session) return router.push("/login");
						setIsReplying(!isReplying);
					}}
					variant='custom1'
					className='border-b-[1px] border-l-[1px] border-dm-accent border-spacing-0.5 hover:text-dm-accent hover:border-gray-600'
					size='xs'
				>
					<MessageSquare className='h-4 w-4 mr-1.5' />
					reply
				</Button>
				{isReplying ? (
					<div className='grid w-full gap-1.5'>
						<Label>your reply comment</Label>
						<div className='mt-2'>
							<Textarea
								id='comment'
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
								rows={1}
								placeholder='reply here...'
								className='border-dm-primary'
							/>
							<div className='mt-2 flex justify-end gap-2'>
								<Button
									className='bg-lm-accent'
									isLoading={isLoading}
									disabled={commentInput.length === 0}
									onClick={() => {
										if (!commentInput) return;
										createCrumbCommentReply({
											commentContent: commentInput,
											crumbId,
											replyToId: comment.replyToId ?? comment.id,
										});
									}}
								>
									post
								</Button>
								<Button
									tabIndex={-1}
									className='bg-red-950/90'
									onClick={() => {
										setIsReplying(!isReplying);
										setCommentInput("");
									}}
								>
									{" "}
									cancel
								</Button>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default CrumbComment;
