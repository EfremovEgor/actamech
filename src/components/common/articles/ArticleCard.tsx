import type { IArticlePreview } from "@components/types/interfaces/articles";
import React, { useState } from "react";
import LucideChevronDown from "~icons/lucide/chevron-down";
export interface IArticleCard extends IArticlePreview {}
const ArticleCard = ({ title, authors, id, extra, abstract }: IArticleCard) => {
	const [open, setOpen] = useState(false);
	return (
		<div>
			<div className="pb-4 border-b-border-secondary border-b-2">
				<span className="text-tertiary-text">{extra}</span>
				<a
					className="mt-4 text-xl cursor-pointer hover-accent block"
					href={`/articles/${id}`}
				>
					{title}
				</a>
				<h2 className="text-accent mt-2">
					{authors.map(({ fullName }) => fullName).join(", ")}
				</h2>

				<div className="flex flex-row justify-between mt-6">
					<span className="uppercase underline text-xs inline hover-accent cursor-pointer">
						View PDF
					</span>
					<button
						onClick={() => setOpen(!open)}
						className="uppercase underline text-xs hover-accent cursor-pointer flex flex-row items-center"
					>
						Article preview{" "}
						<LucideChevronDown
							className={` ${
								open && "rotate-180"
							} transition-transform`}
						/>
					</button>
				</div>
				{open && (
					<div className="mt-4">
						<span className="border-y-border-secondary border-y-2 block py-4 mb-2">
							Abstract
						</span>
						<article className="max-h-[30vh] overflow-auto text-justify px-2">
							{abstract}
						</article>
					</div>
				)}
			</div>
		</div>
	);
};

export default ArticleCard;
