"use client"

export default function TagHandler({title, onDelete}) {
  return (
		<div
			className="
                  px-3 py-1 rounded-full text-sm  
                  bg-yellow-200 text-gray-700 
                  flex items-center gap-2
                "
		>
			{title}
			<button
				onClick={() => onDelete()}
				className="text-gray-600 hover:text-black"
			>
				✕
			</button>
		</div>
	);

}