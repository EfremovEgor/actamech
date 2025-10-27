import apiV1Instance from "@api/axios";
import type {
	Affiliation,
	AffiliationCreate,
	AffiliationListItem,
	AffiliationUpdate,
	APIErrorResponse,
	BaseAPIResponse,
	BasePaginatedAPIResponse,
	PaginationReturn,
} from "@api/types";

export const affiliationService = {
	async getAffiliations(
		searchString?: string
	): Promise<PaginationReturn<AffiliationListItem[]>> {
		const res = await apiV1Instance.get<
			BasePaginatedAPIResponse<AffiliationListItem[]>
		>(`/affiliations`, {
			params: {
				search_string: searchString,
			},
		});
		return [res.data.data.items, res.data.data.meta];
	},
	async getAffiliation(id: string): Promise<Affiliation> {
		const res = await apiV1Instance.get<BaseAPIResponse<Affiliation>>(
			`/affiliations/${id}`
		);
		return res.data.data;
	},

	async updateAffiliation(id: string, data: AffiliationUpdate) {
		await apiV1Instance.put<APIErrorResponse<never>>(
			`/affiliations/${id}`,
			data
		);
	},

	async createAffiliation(data: AffiliationCreate): Promise<Affiliation> {
		const res = await apiV1Instance.post<BaseAPIResponse<Affiliation>>(
			`/affiliations`,
			data
		);
		return res.data.data;
	},
	async removeAffiliationFromAuthor(
		id: string,
		affiliationIds: {
			author_affiliation_id: string;
			affiliation_clarification_id?: number;
		}[]
	) {
		await apiV1Instance.delete<APIErrorResponse<never>>(
			`/authors/${id}/affiliations`,
			{ data: affiliationIds }
		);
	},

	async addAffiliationToAuthor(
		id: string,
		affiliationIds: {
			author_affiliation_id: string;
			affiliation_clarification_id?: number;
		}[]
	) {
		await apiV1Instance.post<APIErrorResponse<never>>(
			`/authors/${id}/affiliations`,
			affiliationIds
		);
	},
	// async deleteAuthor(id: string) {
	// 	await apiV1Instance.delete<APIErrorResponse<never>>(`/authors/${id}`);
	// },
};
