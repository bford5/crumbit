import CloseModal from "@/components/CloseModal";
import SignIn from "@/components/Login";
import { FC } from "react";

const LoginModal: FC = () => {
	return (
		<div className='fixed inset-0 bg-stone-900/20 z-10'>
			<div className='container flex items-center h-full max-w-lg mx-auto'>
				<div className='relative bg-gray-800 text-text-darkMode w-full h-fit py-20 px-2 rounded-lg'>
					<div className='absolute top-4 right-4'>
						<CloseModal />
					</div>

					<SignIn />
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
