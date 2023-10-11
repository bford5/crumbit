"use client";

import { User } from "next-auth";
import { FC } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropDownMenu";
import UserAvatar from "./UserAvatar";
import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserAccountNavProps {
	user: Pick<User, "name" | "image" | "email">;
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<UserAvatar
					user={{
						name: user.name || null,
						image: user.image || null,
					}}
					className='h-8 w-8'
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className='bg-slate-700 text-text-darkMode'
				align='end'
			>
				<div className='flex items-center justify-start gap-2 p-2 text-text-darkMode'>
					<div className='flex flex-col space-y-1 leading-none'>
						{user.name && <p className='font-medium'>{user.name}</p>}
						{user.email && (
							<p className='w-[200px] truncate text-sm'>{user.email}</p>
						)}
					</div>
				</div>

				<DropdownMenuSeparator className='bg-white/60 w-11/12 mx-auto' />

				<DropdownMenuItem asChild>
					<Link href='/'>feed</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href='/c/create'>create community</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link href='/settings'>settings</Link>
				</DropdownMenuItem>

				<DropdownMenuSeparator className='bg-white/60 w-11/12 mx-auto' />

				<DropdownMenuItem
					className='cursor-pointer'
					onSelect={(event) => {
						event.preventDefault();
						signOut({
							callbackUrl: `${window.location.origin}/login`,
						});
					}}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default UserAccountNav;
