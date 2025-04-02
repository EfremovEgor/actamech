import { scrollToId } from "@lib/utils";
import React, { useEffect, useState } from "react";
import type {
	IFigure,
	TArticleContent,
} from "src/pages/articles/ExampleArticle";

const ArticleNavFigures = ({ content }: { content: TArticleContent[] }) => {
	const [expanded, setExpanded] = useState(false);
	const limit = 6;
	const findAllFigures = (content: TArticleContent[]) => {
		let figures: IFigure[] = [];
		content.forEach((element) => {
			if (element.type == "figure") {
				figures.push(element);
			} else if (element.type == "section")
				figures.push(...findAllFigures(element.content));
		});
		return figures;
	};
	let figures: IFigure[] = findAllFigures(content);

	return (
		<div className="border-b-border-primary border-b-1 pb-4 mt-8">
			<h3 className="text-xl font-semibold">
				Figures ({figures.length})
			</h3>
			<div className="grid grid-cols-3 gap-4 mt-4">
				{figures.map(
					(figure, i) =>
						(i < limit || expanded) && (
							<img
								onClick={() =>
									scrollToId(`figure-${figure.number}`)
								}
								src={figure.image}
								alt=""
							/>
						)
				)}
			</div>
			{figures.length - 6 > 0 && (
				<button
					className="cursor-pointer mt-4 text-primary-text/40 font-semibold"
					onClick={() => {
						setExpanded(!expanded);
					}}
				>
					{expanded
						? `Hide`
						: `Show ${figures.length - limit} more figures`}
				</button>
			)}
		</div>
	);
};

export default ArticleNavFigures;
