import React, { useState } from "react";
import LucideChevronDown from "~icons/lucide/chevron-down";
export interface INewsCard {
	title: string;
	date: string;
	text: string;
	imageURL: string;
}

const NewsCard = ({ title, date, text, imageURL }: INewsCard) => {
	const [open, setOpen] = useState(false);

	return (
		<div className="px-4 py-8 shadow-lg rounded p-2">
			<h1 className="text-center border-underline-2 text-xl pb-2">
				{title}
			</h1>
			<p className="text-center text-tertiary-text mt-2 text-lg">
				{date}
			</p>
			<div className="flex flex-row">
				<img className="w-60 object-cover h-60 p-4" src={imageURL} />
				<div>
					<p
						className={`mt-8 text-justify ${
							!open && "overflow-ellipsis line-clamp-4"
						} `}
					>
						{text}
					</p>
					<div className="border-t-border-primary border-t-2 mt-4 pt-4">
						<button
							onClick={() => setOpen(!open)}
							className="hover-accent cursor-pointer"
						>
							{open ? "Show less" : "Show more"}{" "}
							<LucideChevronDown
								className={` ${
									open && "rotate-180"
								} transition-transform inline`}
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewsCard;
