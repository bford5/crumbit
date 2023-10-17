import { getAuthSession } from "@/lib/auth";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import { FC } from "react";
import CrumbVoteClient from "./CrumbVoteClient";

interface CrumbVoteServerProps {
	crumbId: string;
	initialVotesAmount?: number;
	initialVote?: VoteType | null;
	getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const CrumbVoteServer = async ({
	crumbId,
	initialVotesAmount,
	initialVote,
	getData,
}: CrumbVoteServerProps) => {
	const session = await getAuthSession();

	let _votesAmount: number = 0;
	let _currentVote: VoteType | null | undefined = undefined;

	if (getData) {
		const crumb = await getData();
		// getData() defined in parent
		if (!crumb) return notFound();

		_votesAmount = crumb.votes.reduce((acc, vote) => {
			if (vote.type === "UP") return acc + 1;
			if (vote.type === "DOWN") return acc - 1;
			return acc;
		}, 0);

		_currentVote = crumb.votes.find(
			(vote) => vote.userId === session?.user.id
		)?.type;
	} else {
		_votesAmount = initialVotesAmount!;
		_currentVote = initialVote;
	}

	return (
		<CrumbVoteClient
			crumbId={crumbId}
			initialVotesAmount={_votesAmount}
			initialVote={_currentVote}
		/>
	);
};

export default CrumbVoteServer;
