import type { IArticlePreview } from "@components/types/interfaces/articles";
import { resolveArticleType } from "@lib/articles";
import { formatDate } from "@lib/client/utils";
import React, { useState } from "react";
import type { TArticleType } from "src/api/types";
import LucideChevronDown from "~icons/lucide/chevron-down";
export interface IArticleCard extends IArticlePreview {}
interface Props {
	id: string;
	abstract: string;
	title: string;
	type: TArticleType;
	editorial: boolean;
	published_at: string;
	link?: string;
	authors: {
		first_name: string;
		last_name: string;
	}[];
}

const ArticleCard = ({
	id,
	abstract,
	title,
	authors,
	type,
	editorial,
	published_at,
	link,
}: Props) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="pb-4 border-b-border-secondary border-b-2">
			<span className="text-tertiary-text">
				{editorial ? "Editorial" : resolveArticleType(type)}{" "}
				{published_at && `| ${formatDate(published_at)}`}
			</span>
			<a
				className="mt-4 text-xl cursor-pointer hover-accent block"
				href={link ?? `/articles/${id}`}
			>
				{title}
			</a>
			<h2 className="text-accent mt-2">
				{authors
					.map(
						({ first_name, last_name }) =>
							`${first_name} ${last_name}`
					)
					.join(", ")}
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
	);
};

export default ArticleCard;
