import React from "react";
import type { IFigure } from "src/pages/articles/ExampleArticle";

const ArticleFigure = ({ figure }: { figure: IFigure }) => {
	return (
		<div className="pt-6 pb-3">
			<div
				id={`figure-${figure.number}`}
				className="pb-3 border-b-1 border-b-border-primary"
			>
				<img
					className="max-w-full h-auto  mx-auto"
					src={figure.image}
				/>
				<span className="mt-8 block text-lg text-center">
					Fig. {figure.number}. {figure.title}
				</span>
			</div>
		</div>
	);
};

export default ArticleFigure;
