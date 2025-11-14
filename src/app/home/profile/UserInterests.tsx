import { Star } from 'lucide-react'

const INTEREST_COLORS = [
	"#FFD200", // tinkoff-yellow
	"#27BFFF", // airlines
	"#4972CF", // premium
	"#00B640", // business
	"#FFDD2D", // tinkoff-brand
	"#9A06FF", // ai-assistant
];

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
				const color = INTEREST_COLORS[idx % INTEREST_COLORS.length];

				return (
					<div
						key={idx}
						className="flex items-center justify-between px-4 py-3 rounded-2xl"
						style={{ backgroundColor: color + "22" }} // мягкий фон (прозрачность)
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
