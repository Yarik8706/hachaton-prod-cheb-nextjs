import { create } from "zustand";
import { UserInterestsDialog } from '@/components/dialogs/UserInterestsDialog'
import { useProfile } from "@/store/profile.store";

interface InterestsModalState {
	open: boolean;
	setOpen: (v: boolean) => void;
}

export const useInterestsModal = create<InterestsModalState>((set) => ({
	open: false,
	setOpen: (v) => set({ open: v }),
}));

export function GlobalInterestsDialog() {
	const open = useInterestsModal((s) => s.open);
	const setOpen = useInterestsModal((s) => s.setOpen);
	const {setInterests} = useProfile()
	
	return (
		<UserInterestsDialog
			open={open}
			onOpenChange={setOpen}
			onChange={(value) => {
				setInterests(value)
			}}
		/>
	);
}