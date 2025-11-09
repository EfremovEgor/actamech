import type {
	APIErrorResponse,
	Author,
	AuthorCreate,
	AuthorListItem,
	AuthorUpdate,
	BaseAPIResponse,
	BasePaginatedAPIResponse,
	PaginatatedSearchRequest,
	PaginationReturn,
} from "@api/types";
import apiV1Instance from "../axios";
export const authorService = {
	async getAuthors(
		params?: PaginatatedSearchRequest
	): Promise<PaginationReturn<AuthorListItem[]>> {
		const res = await apiV1Instance.get<
			BasePaginatedAPIResponse<AuthorListItem[]>
		>(`/authors`, {
			params,
		});
		return [res.data.data.items, res.data.data.meta];
	},
	async getAuthor(id: string): Promise<Author> {
		const res = await apiV1Instance.get<BaseAPIResponse<Author>>(
			`/authors/${id}`
		);
		return res.data.data;
	},

	async updateAuthor(id: string, data: AuthorUpdate) {
		await apiV1Instance.put<APIErrorResponse<never>>(
			`/authors/${id}`,
			data
		);
	},

	async createAuthor(data: AuthorCreate): Promise<Author> {
		const res = await apiV1Instance.post<BaseAPIResponse<Author>>(
			`/authors`,
			data
		);
		return res.data.data;
	},

	async deleteAuthor(id: string) {
		await apiV1Instance.delete<APIErrorResponse<never>>(`/authors/${id}`);
	},
};
