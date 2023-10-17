"use client";

import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINIT_SCROLLING_PAGINATION_RESULTS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Crumb from "./Crumb";

interface CrumbFeedProps {
	initialPosts: ExtendedPost[];
	crumbbasketName?: string;
}

const CrumbFeed: FC<CrumbFeedProps> = ({ initialPosts, crumbbasketName }) => {
	const lastCrumbRef = useRef<HTMLElement>(null);

	const { ref, entry } = useIntersection({
		root: lastCrumbRef.current,
		threshold: 1,
	});

	const { data: session } = useSession();

	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		["infinite-query"],
		async ({ pageParam = 1 }) => {
			const query =
				`/api/crumbs?limit=${INFINIT_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` +
				(!!crumbbasketName ? `&crumbbasketName=${crumbbasketName}` : "");
			const { data } = await axios.get(query);
			return data as ExtendedPost[];
		},
		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			initialData: { pages: [initialPosts], pageParams: [1] },
		}
	);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage();
		}
	}, [entry, fetchNextPage]);

	const crumbs = data?.pages.flatMap((page) => page) ?? initialPosts;

	return (
		<ul className='flex flex-col col-span-2 space-y-2 w-full mt-4'>
			{crumbs.map((post, index) => {
				const votesAmount = post.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				const currentVote = post.votes.find(
					(vote) => vote.userId === session?.user.id
				);

				if (index === crumbs.length - 1) {
					return (
						<li key={post.id} ref={ref}>
							<Crumb
								currentVote={currentVote}
								votesAmount={votesAmount}
								commentAmount={post.comments.length}
								crumbbasketName={post.crumbbasket.name}
								crumb={post}
							/>
						</li>
					);
				} else {
					return (
						<Crumb
							key={post.id}
							currentVote={currentVote}
							votesAmount={votesAmount}
							commentAmount={post.comments.length}
							crumbbasketName={post.crumbbasket.name}
							crumb={post}
						/>
					);
				}
			})}
		</ul>
	);
};

export default CrumbFeed;
