import type { AffiliationInAuthor, AuthorInArticle } from "src/api/types";

export const scrollToId = (id: string) => {
	const element = document.getElementById(id);
	if (!element) return;
	const headerOffset = 100;
	const elementPosition = element.getBoundingClientRect().top;
	const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth",
	});
};

export function formatDate(isoString: string) {
	const date = new Date(isoString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}
