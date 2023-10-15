"use client";

import { Button } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CrumbVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { FC, useEffect, useState } from "react";

interface CrumbVoteClientProps {
	crumbId: string;
	initialVotesAmount: number;
	initialVote?: VoteType | null;
}

const CrumbVoteClient: FC<CrumbVoteClientProps> = ({
	crumbId: postId,
	initialVotesAmount,
	initialVote,
}) => {
	const { loginToast } = useCustomToast();
	const [votesAmount, setVotesAmount] = useState<number>(initialVotesAmount);
	const [currVote, setCurrVote] = useState(initialVote);
	const prevVote = usePrevious(currVote);

	useEffect(() => {
		setCurrVote(initialVote);
	}, [initialVote]);

	const { mutate: voteFunc } = useMutation({
		mutationFn: async (voteType: VoteType) => {
			const payload: CrumbVoteRequest = {
				postId,
				voteType,
			};

			await axios.patch("/api/crumbbasket/crumb/vote", payload);
		},
		onError: (err, voteType) => {
			if (voteType === "UP") {
				setVotesAmount((prev) => prev - 1);
			} else setVotesAmount((prev) => prev + 1);

			// reset current vote
			setCurrVote(prevVote);

			if (err instanceof AxiosError) {
				if (err.response?.status === 401) {
					return loginToast();
				}
			}

			return toast({
				title: "something went wrong",
				description: "vote attempt was not registered, please try again",
				variant: "destructive",
			});
		},
		onMutate: (type: VoteType) => {
			if (currVote === type) {
				setCurrVote(undefined);
				if (type === "UP") setVotesAmount((prev) => prev - 1);
				else if (type === "DOWN") setVotesAmount((prev) => prev + 1);
			} else {
				setCurrVote(type);
				if (type === "UP") setVotesAmount((prev) => prev + (currVote ? 2 : 1));
				else if (type === "DOWN")
					setVotesAmount((prev) => prev - (currVote ? 2 : 1));
			}
		},
	});

	return (
		<div className='flex sm:flex-col gap-4 sm:gap-1 pr-6 sm:w-20 pb-4 sm:pb-1'>
			<Button
				onClick={() => voteFunc("UP")}
				size='sm'
				variant='custom1'
				aria-label='upvote'
			>
				<ArrowBigUp
					className={cn("h-5 w-5 text-text-darkMode hover:text-dm-accent", {
						"text-dm-accent fill-dm-accent": currVote === "UP",
					})}
				/>
			</Button>
			<p className='text-center py-2 font-medium text-sm text-text-darkMode'>
				{votesAmount}
			</p>
			<Button
				onClick={() => voteFunc("DOWN")}
				size='sm'
				variant='custom1'
				aria-label='downvote'
			>
				<ArrowBigDown
					className={cn("h-5 w-5 text-text-darkMode hover:text-red-700", {
						"text-red-500 fill-red-500": currVote === "DOWN",
					})}
				/>
			</Button>
		</div>
	);
};

export default CrumbVoteClient;
