import SerialFormatting from "@components/common/SerialFormatting";
import { makeAffiliationsTagsFromAuthors } from "@lib/articles";
import React, { useState } from "react";
import type {
	AffiliationInAuthor,
	ArticleVolume,
	AuthorInArticle,
} from "src/api/types";
import type {
	IAffiliation,
	IArticleAuthor,
} from "src/pages/articles/ExampleArticle";
import LucideChevronDown from "~icons/lucide/chevron-down";

const AuthorsAffiliations = ({
	authors,
	volume,
}: {
	authors: AuthorInArticle[];
	volume?: ArticleVolume;
}) => {
	const [open, setOpen] = useState(false);
	const [affiliationAliases, affiliationsData] =
		makeAffiliationsTagsFromAuthors(authors);
	return (
		<>
			<button
				onClick={() => setOpen(!open)}
				className="text-primary-text/40 mt-2 cursor-pointer"
			>
				{open ? "Show less" : "Show more"}
				<LucideChevronDown
					className={` ${
						open && "rotate-180"
					} transition-transform inline`}
				/>
			</button>
			{open && (
				<div className="px-4 lg:px-8 text-left w-fit mx-auto lg:max-w-7/8 mt-4 pb-4 border-b-1 border-b-border-primary">
					<ul>
						{Object.entries(affiliationsData).map(([id, af]) => (
							<li>
								<sup className="font-bold text-accent">
									{affiliationAliases[id]}
								</sup>{" "}
								- {af.name}, {af.address}, {af.postal_code}{" "}
								{af.country}
							</li>
						))}
					</ul>
					<div className="text-primary-text/60 text-sm mt-2">
						This article belongs to the Proceedings of{" "}
						<SerialFormatting
							str={volume!.conference_full_name}
							wrapper="span"
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default AuthorsAffiliations;
