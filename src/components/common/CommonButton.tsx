"use client"

export default function CommonButton({onClick, text, color="[var(--main-color)]"}) {

  return (
		<button
			onClick={() => onClick(true)}
			className={`bg-${color} hover:bg-yellow-500 transition text-black px-5 py-3 rounded-xl text-sm font-medium`}>
			{text}
		</button>
	);

}