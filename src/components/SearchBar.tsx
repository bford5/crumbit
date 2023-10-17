"use client";

import { FC, useCallback, useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "./ui/command";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Crumbbasket, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import debounce from "lodash.debounce";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
	// const tempLoading = false;

	const [searchInput, setSearchInput] = useState<string>("");

	// debouncing
	const request = debounce(async () => {
		await refetch();
	}, 369);
	const debounceRequest = useCallback(() => {
		request();
	}, []);
	// ---

	const {
		data: queryResult,
		refetch,
		isFetched,
		isFetching,
	} = useQuery({
		queryFn: async () => {
			if (!searchInput) return [];

			const { data } = await axios.get(`/api/search?q=${searchInput}`);
			return data as (Crumbbasket & {
				_countValue: Prisma.CrumbbasketCountOutputType;
			})[];
		},
		queryKey: ["seach query"],
		enabled: false,
	});

	const router = useRouter();

	return (
		<Command className='relative rounded-lg border max-w-lg z-50 overflow-visible'>
			<CommandInput
				value={searchInput}
				onValueChange={(text) => {
					setSearchInput(text);
					debounceRequest();
				}}
				className='outline-none border-none focus:border-none focus:outline-none ring-0'
				placeholder='search crumbbaskets...'
				isLoading={isFetching}
			/>
			{searchInput.length > 0 ? (
				<CommandList className='absolute bg-dm-secondary top-full inset-x-0 shadow rounded-b-md'>
					{isFetched && <CommandEmpty>no results found.</CommandEmpty>}
					{(queryResult?.length ?? 0) > 0 ? (
						<CommandGroup heading='crumbbaskets'>
							{queryResult?.map((crumbbasket) => (
								<CommandItem
									onSelect={(e) => {
										router.push(`/c/${e}`);
										router.refresh();
									}}
									key={crumbbasket.id}
									value={crumbbasket.name}
								>
									<Users className='mr-2 h-4 w-4' />
									<a href={`/c/${crumbbasket.name}`}>c/{crumbbasket.name}</a>
								</CommandItem>
							))}
						</CommandGroup>
					) : null}
				</CommandList>
			) : null}
		</Command>
	);
};

export default SearchBar;
