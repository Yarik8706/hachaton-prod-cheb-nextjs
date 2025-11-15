import { Star } from 'lucide-react'

export default function UserInterests({ interests }: { interests: string[] }) {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
						<Star color={"white"}/>
					</div>

					<div className="text-[16px] text-gray-800">
						Ваши интересы:
					</div>
				</div>
			</div>
			{interests.map((item, idx) => {
				
				return (
					<div
						key={idx}
						className="flex items-center justify-between px-4 py-3 rounded-2xl"
						style={{ backgroundColor: "#FFD20022" }} // мягкий фон (прозрачность)
					>
						<div className="flex items-center gap-4">

							<div className="text-[16px] text-gray-800">
								{item}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
