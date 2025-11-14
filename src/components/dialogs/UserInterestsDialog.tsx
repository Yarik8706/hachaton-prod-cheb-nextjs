"use client";

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/store/profile.store";
import TagHandler from '@/components/common/TagHandler'
import SetInterests from '@/components/forms/SetInterests'

interface Props {
	open: boolean;
	onOpenChange: (state: boolean) => void;
	onChange: (values: string[]) => void;
}

export function UserInterestsDialog({ open, onOpenChange, onChange }: Props) {
	const [value, setValue] = useState("");
	const {profile} = useProfile()
	const [interests, setInterests] = useState<string[]>(
		() => profile?.interests || []);

	useEffect(() => {
		setInterests(profile?.interests || []);
	}, [profile]);
	
	const addInterest = () => {
		const v = value.trim();
		if (!v) return;
		const updated = [...interests, v];
		setInterests(updated);
		onChange(updated);
		setValue("");
	};

	const removeInterest = (index: number) => {
		const updated = interests.filter((_, i) => i !== index);
		setInterests(updated);
		onChange(updated);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold">
						Укажите ваши интересы
					</DialogTitle>
				</DialogHeader>
				<SetInterests
					value={value}
					setValue={setValue}
					interests={interests}
					addInterest={addInterest}
					removeInterest={removeInterest}
				/>
				<div className="flex justify-end mt-6">
					<Button
						disabled={interests.length === 0}
						onClick={() => onOpenChange(false)}
						className="bg-yellow-400 text-black hover:bg-yellow-500"
					>
						Понятно
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
