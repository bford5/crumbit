"use client";

import { FC, startTransition } from "react";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToCrumbbasketPayload } from "@/lib/validators/crumbbasket";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SubLeaveToggleProps {
	crumbbasketId: string;
	crumbbasketName: string;
	isSubscribed: boolean;
}

const SubLeaveToggle: FC<SubLeaveToggleProps> = ({
	crumbbasketId,
	crumbbasketName,
	isSubscribed,
}) => {
	// const isSubscribed = false;
	const { loginToast } = useCustomToast();
	const router = useRouter();

	const { mutate: subscribeToCrumbbasket, isLoading: isSubLoading } =
		useMutation({
			mutationFn: async () => {
				const payload: SubscribeToCrumbbasketPayload = {
					crumbbasketId,
				};

				const { data } = await axios.post(
					"/api/crumbbasket/subscribe",
					payload
				);
				return data as string;
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
				startTransition(() => {
					router.refresh();
				});
				return toast({
					title: "success",
					description: `you have subscribed to c/${crumbbasketName}`,
				});
			},
		});

	const { mutate: unSubscribeFromCrumbbasket, isLoading: isUnSubLoading } =
		useMutation({
			mutationFn: async () => {
				const payload: SubscribeToCrumbbasketPayload = {
					crumbbasketId,
				};

				const { data } = await axios.post(
					"/api/crumbbasket/unsubscribe",
					payload
				);
				return data as string;
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
				startTransition(() => {
					router.refresh();
				});
				return toast({
					title: "success",
					description: `you have subscribed to c/${crumbbasketName}`,
				});
			},
		});

	return isSubscribed ? (
		<Button
			onClick={() => unSubscribeFromCrumbbasket()}
			isLoading={isUnSubLoading}
			className='bg-dm-primary text-text-lightMode hover:text-text-darkMode transition-all duration-200'
		>
			Leave
		</Button>
	) : (
		<Button
			onClick={() => subscribeToCrumbbasket()}
			isLoading={isSubLoading}
			className='bg-dm-primary text-text-lightMode hover:text-text-darkMode transition-all duration-200'
		>
			Subscribe
		</Button>
	);
};

export default SubLeaveToggle;
