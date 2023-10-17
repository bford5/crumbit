"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateCrumbbasketPayload } from "@/lib/validators/crumbbasket";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";

const Page = () => {
	const [input, setInput] = useState<string>("");
	const { loginToast } = useCustomToast();

	const router = useRouter();

	const { mutate: createCrumbbasket, isLoading } = useMutation({
		mutationFn: async () => {
			const payload: CreateCrumbbasketPayload = {
				name: input,
			};

			const { data } = await axios.post("/api/crumbbasket", payload);
			return data as string;
		},
		onError: (err) => {
			if (err instanceof AxiosError) {
				if (err.response?.status === 409) {
					return toast({
						title: "crumbbasket already exists",
						description: "please choose another name for your crumbbasket",
						variant: "destructive",
					});
				}
				if (err.response?.status === 422) {
					return toast({
						title: "not allowed",
						description:
							"the crumbbasket name entered is not allowed, please choose another",
						variant: "destructive",
					});
				}
				if (err.response?.status === 401) {
					return loginToast();
				}
			}
			toast({
				title: "an error occurred",
				description: "could not complete request",
				variant: "destructive",
			});
		},
		onSuccess: (data) => {
			router.push(`/c/${data}`);
		},
	});

	return (
		<section className='container flex items-center h-full max-w-3xl mx-auto mt-4 text-text-darkMode'>
			<div className='relative bg-dm-secondary w-full h-fit p-4 rounded-lg space-y-6'>
				<div className='flex justify-between items-center'>
					<h1 className='text-xl font-semibold'>Create a crumbbasket</h1>
				</div>
				<hr className='bg-dm-accent h-[1px] border-t-0' />
				<div>
					<p className='text-lg font-medium'>Name</p>
					<p className='text-xs pb-2'>
						Community, ie crumbbasket, names including capitalization cannot be
						changed.
					</p>
					<div className='relative'>
						<p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-text-darkMode'>
							c/
						</p>
						<Input
							type='input'
							// ignorign ts-error below, cant see any actual issue
							value={input}
							onChange={(e) => setInput(e.target.value)}
							className='pl-6'
						/>
					</div>
				</div>
				<div className='flex justify-end gap-4'>
					<Button
						isLoading={isLoading}
						disabled={input.length <= 2}
						onClick={() => createCrumbbasket()}
						className='bg-dm-accent text-text-lightMode hover:bg-dm-primary hover:text-gray-800'
					>
						Create
					</Button>
					<Button onClick={() => router.push("/")}>Cancel</Button>
				</div>
			</div>
		</section>
	);
};

export default Page;
