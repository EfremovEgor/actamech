export interface IArticlePreview {
	id: string;
	title: string;
	authors: { fullName: string }[];
	extra: string;
	abstract?: string;
}
