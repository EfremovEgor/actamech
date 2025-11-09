import apiV1Instance from "../axios";
import type {
	APIErrorResponse,
	Article,
	ArticleListItem,
	ArticleUpdate,
	AuthorListItem,
	BaseAPIResponse,
	BasePaginatedAPIResponse,
	PaginatatedSearchRequest,
	PaginationReturn,
} from "../types";

export const articleService = {
	async createArticle(): Promise<Article> {
		const res = await apiV1Instance.post<BaseAPIResponse<Article>>(
			`/articles`,
			{}
		);
		return res.data.data;
	},
	async getArticle(id: string): Promise<Article> {
		const res = await apiV1Instance.get<BaseAPIResponse<Article>>(
			`/articles/${id}`
		);
		return res.data.data;
	},

	async getArticles(
		params?: PaginatatedSearchRequest
	): Promise<PaginationReturn<ArticleListItem[]>> {
		const res = await apiV1Instance.get<
			BasePaginatedAPIResponse<ArticleListItem[]>
		>(`/articles`, { params });
		return [res.data.data.items, res.data.data.meta];
	},

	async updateArticle(id: string, data: ArticleUpdate) {
		await apiV1Instance.put<APIErrorResponse<never>>(
			`/articles/${id}`,
			data
		);
	},

	async deleteArticle(id: string) {
		await apiV1Instance.delete<APIErrorResponse<never>>(`/articles/${id}`);
	},

	async getAvailableAuthorsToAdd(
		id: string,
		searchString?: string
	): Promise<PaginationReturn<AuthorListItem[]>> {
		const res = await apiV1Instance.get<
			BasePaginatedAPIResponse<AuthorListItem[]>
		>(`/articles/${id}/authors`, {
			params: {
				search_string: searchString,
			},
		});
		return [res.data.data.items, res.data.data.meta];
	},

	async removeAuthorFromArticle(id: string, authorIds: string[]) {
		await apiV1Instance.delete<APIErrorResponse<never>>(
			`/articles/${id}/authors`,
			{ data: authorIds }
		);
	},

	async addAuthorToArticle(id: string, authorIds: string[]) {
		await apiV1Instance.post<APIErrorResponse<never>>(
			`/articles/${id}/authors`,
			authorIds
		);
	},

	async uploadArticlePDF(id: string, file: File) {
		if (!file) return;

		const formData = new FormData();
		formData.append("file", file);

		await apiV1Instance.put<APIErrorResponse<never>>(
			`/articles/${id}/pdf`,
			formData,
			{ headers: { "Content-Type": "multipart/form-data" } }
		);
	},
};
