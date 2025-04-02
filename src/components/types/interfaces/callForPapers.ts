import type { IArticle } from "src/pages/articles/ExampleArticle";
import type { IArticlePreview } from "./articles";

export interface ICallForPaper {
	id: string;
	title: string;
	lastUpdated?: string;
	submissionDeadline: string;
	description: string;
	editors: {
		fullName: string;
		title: string;
		country: string;
		affiliation: string;
	}[];
	articles: IArticlePreview;
}
