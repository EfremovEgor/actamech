import React from "react";
import type {
	IArticle,
	TArticleContent,
} from "src/pages/articles/ExampleArticle";
import ArticleFigure from "./ArticleFigure";
import ArticleTable from "./ArticleTable";
import type { SingleArticleResponse } from "src/api/types";
const ArticleContent = ({ article }: { article: SingleArticleResponse }) => {
	const handleArticleContentRender = (content: TArticleContent) => {
		switch (content.type) {
			case "figure":
				return (
					<section>
						{content && <ArticleFigure figure={content} />}
					</section>
				);
			case "table":
				return (
					<section>
						{content && <ArticleTable table={content} />}
					</section>
				);
			case "section":
				return (
					<>
						<h2 id={content.number + content.title}>
							{content.number && `${content.number}. `}{" "}
							{content.title}
						</h2>
						<section>{generateContents(content.content)}</section>
					</>
				);
			case "keywords":
				return (
					<>
						<h2 id="keywords">Keywords</h2>
						<section>
							<p>{content.content.join("; ")}</p>
						</section>
					</>
				);
			case "abstract":
				return (
					<>
						<h2 id="abstract">Abstract</h2>
						<section>
							<p>{content.content}</p>
						</section>
					</>
				);
			case "text":
				return <p>{content.content}</p>;
			default:
				break;
		}
		return;
	};

	const generateContents = (contents: TArticleContent[]) => {
		return (
			<>
				{contents.map((content) => handleArticleContentRender(content))}
			</>
		);
	};

	return (
		<div>
			<article className="article-content">
				<h2 id="abstract">Abstract</h2>
				<section>
					<p>{article.abstract}</p>
				</section>
				<h2 id="keywords">Keywords</h2>
				<section>
					<p>{article.keywords.join("; ")}</p>
				</section>
				{article.body &&
					article.body.map((section) => {
						switch (section.type) {
							case "acknowledgement":
								return (
									<>
										<h2 id="acknowledgement">
											Acknowledgement
										</h2>
										<section>
											<p>{section.content}</p>
										</section>
									</>
								);
							case "funding":
								return (
									<>
										<h2 id="funding">Funding</h2>
										<section>
											<p>{section.content}</p>
										</section>
									</>
								);
							default:
								break;
						}
					})}
				{/* <section>
					<h2 id="references">References</h2>
					<div className="flex flex-row items-center gap-8 mt-8">
						<span className="text-2xl">[1]</span>
						<div>
							<span className="text-accent font-semibold">
								Y.D. Wu, W. Wang, H.X. Zhu, S.F. Wu, C.J.
								Damaren
							</span>
							<p className="font-semibold">
								Adaptive fault-tolerant control for spacecraft
								formation under external disturbances with
								guaranteed performance
							</p>
						</div>
					</div>
					<div className="flex flex-row items-center gap-8 mt-8">
						<span className="text-2xl">[2]</span>
						<div>
							<span className="text-accent font-semibold">
								Y.D. Wu, W. Wang, H.X. Zhu, S.F. Wu, C.J.
								Damaren
							</span>
							<p className="font-semibold">
								Adaptive fault-tolerant control for spacecraft
								formation under external disturbances with
								guaranteed performance
							</p>
						</div>
					</div>
				</section> */}

				{/* <section>
					<h2 id="references">Cited by (0)</h2>
				</section> */}
				{/* <section className="text-accent font-semibold mt-8">
					<p>View Abstract</p>
					<p>
						© 2025 IAA. Published by Actamech. All rights are
						reserved, including those for text and data mining, AI
						training, and similar technologies.
					</p>
				</section> */}
			</article>
		</div>
	);
};

export default ArticleContent;
