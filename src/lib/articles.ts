import type {
	AffiliationInAuthor,
	AuthorInArticle,
	SingleArticleResponse,
	TArticleType,
} from "src/api/types";

export const makeAffiliationsTagsFromAuthors = (
	authors: AuthorInArticle[]
): [Record<string, string>, Record<string, AffiliationInAuthor>] => {
	let affiliationAliases: Record<string, string> = {};
	let currentLetter = 97;
	let affiliationsData: Record<string, AffiliationInAuthor> = {};
	authors.forEach(({ affiliations }) => {
		affiliations.forEach((af) => {
			if (!affiliationAliases[af.id]) {
				affiliationAliases[af.id] = String.fromCharCode(currentLetter);
			}
			affiliationsData[af.id] = af;
			currentLetter += 1;
		});
	});
	return [affiliationAliases, affiliationsData];
};

export const resolveArticleType = (type: TArticleType) => {
	switch (type) {
		case "conference_paper":
			return "Conference Paper";
		case "research_paper":
			return "Research Paper";
		default:
			break;
	}
};
