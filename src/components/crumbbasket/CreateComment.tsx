"use client";

import { FC, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
	crumbId: string;
	replyToId?: string;
}

const CreateComment: FC<CreateCommentProps> = ({ crumbId, replyToId }) => {
	const [commentInput, setCommentInput] = useState("");

	const { loginToast } = useCustomToast();

	const router = useRouter();

	const { mutate: createComment, isLoading } = useMutation({
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
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}
			return toast({
				title: "something went wrong",
				description: "could not complete request",
				variant: "destructive",
			});
		},
		onSuccess: () => {
			router.refresh();
			setCommentInput("");
		},
	});

	return (
		<div className='grid w-full gap-1. px-4 pt-0.5'>
			<Label htmlFor='comment'>your comment</Label>
			<div className='mt-2'>
				<Textarea
					id='comment'
					value={commentInput}
					onChange={(e) => setCommentInput(e.target.value)}
					rows={1}
					placeholder='comment here...'
					className='border-dm-primary'
				/>
				<div className='mt-2 flex justify-end'>
					<Button
						className='bg-lm-accent'
						isLoading={isLoading}
						disabled={commentInput.length === 0}
						onClick={() =>
							createComment({
								commentContent: commentInput,
								crumbId,
								replyToId,
							})
						}
					>
						post
					</Button>
				</div>
			</div>
		</div>
	);
};

export default CreateComment;
