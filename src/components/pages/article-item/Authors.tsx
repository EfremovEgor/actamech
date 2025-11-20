import AuthorSlidePanel from "@components/authors/AuthorSlidePanel";
import React, { useState } from "react";
import type { IArticleAuthor } from "src/pages/articles/ExampleArticle";
import AuthorsAffiliations from "./AuthorsAffiliations";
import type { ArticleVolume, AuthorInArticle } from "src/api/types";
import { makeAffiliationsTagsFromAuthors } from "@lib/articles";

const Authors = ({
	authors,
	volume,
}: {
	authors: AuthorInArticle[];
	volume?: ArticleVolume;
}) => {
	const [open, setOpen] = useState(false);
	const [currentAuthor, setCurrentAuthor] = useState<AuthorInArticle | null>(
		null
	);
	const handleClick = (author: AuthorInArticle) => {
		if (author !== currentAuthor && open) {
			setCurrentAuthor(author);
			return;
		}
		setCurrentAuthor(author);
		setOpen(!open);
	};
	const [affiliationAliases, affiliationsData] =
		makeAffiliationsTagsFromAuthors(authors);
	return (
		<>
			<p className="text-xl text-accent font-semibold mt-4 w-fit mx-auto cursor-pointer select-text">
				{authors.map((author, index) => (
					<>
						<span
							className="hover:underline"
							onClick={() => handleClick(author)}
						>
							{author.first_name} {author.last_name}
							<sup>
								{author.affiliations
									.map((af) => affiliationAliases[af.id])
									.join(" ")}
							</sup>
						</span>
						{index < authors.length - 1 && ", "}
					</>
				))}
			</p>
			{open && currentAuthor && (
				<AuthorSlidePanel
					author={currentAuthor}
					onCloseCallback={() => {
						setOpen(false);
					}}
				/>
			)}
			<AuthorsAffiliations volume={volume} authors={authors} />
		</>
	);
};

export default Authors;
