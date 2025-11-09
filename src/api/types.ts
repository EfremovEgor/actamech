export interface BaseAPIResponse<T> {
	data: T;
	message?: string;
}
export interface PaginatedRequest {
	page?: number;
	per_page?: number;
}
export interface PaginatatedSearchRequest extends PaginatedRequest {
	search_string?: string;
}

export type APIErrorResponse<T> = BaseAPIResponse<T>;

export interface PaginationMeta {
	total: number;
	page: number;
	per_page: number;
	pages: number;
}
export interface BasePaginatedAPIResponse<T> {
	data: {
		items: T;
		meta: PaginationMeta;
	};
	message: string;
}

export type PaginationReturn<T> = [T, PaginationMeta];
export type ArticleType = "research_paper" | "conference_paper";
export interface AuthorInArticle {
	id: string;
	first_name: string;
	last_name: string;
	middle_name?: string;
	email?: string;
	scopus_id?: string;
	orcid_id?: string;
}
export interface VolumeInArticle {
	id: string;
	volume_number: string;
	title: string;
	published_at: string;
}
export interface Article {
	id: string;
	title: string;
	abstract: string;
	pages_in_volume: string;
	keywords: string[];
	type: ArticleType;
	editorial: boolean;
	doi: string;
	received_at: string;
	revised_at: string;
	accepted_at: string;
	published_at: string;
	body: { [key: string]: string }[];
	authors: AuthorInArticle[];
	volume?: VolumeInArticle;
}
export type ArticleListItem = Pick<Article, "id" | "title" | "doi">;

export interface ArticleUpdate
	extends Partial<Omit<Article, "authors" | "volume">> {
	volume_id?: string;
}
export type ArticleCreate = Pick<Article, "id" | "type" | "editorial">;

export interface AffiliationInAuthor {
	id: string;
	name: string;
	address: string;
	city: string;
	country: string;
	postal_code: string;
	clarification?: {
		id: number;
		faculty?: string;
		department?: string;
	};
}

export interface Author {
	id: string;
	first_name: string;
	last_name: string;
	middle_name?: string | null;
	email?: string | null;
	scopus_id?: string | null;
	orcid_id?: string | null;
	created_at: string;
	affiliations: AffiliationInAuthor[];
}
export type AuthorListItem = Pick<Author, "id" | "first_name" | "last_name">;
export type AuthorUpdate = Partial<
	Omit<Author, "id" | "created_at" | "affiliations">
>;
export type AuthorCreate = Omit<Author, "id" | "created_at" | "affiliations">;

export interface VolumeListItem {
	id: string;
	title: string;
	volume_number: string;
}

export interface Affiliation {
	id: string;
	name: string;
	country: string;
	city: string;
	address: string;
	postal_code?: string | null;
	aliases: {
		id: number;
		alias: string;
	}[];
	clarifications: {
		id: number;
		faculty: string | null;
		department: string | null;
	}[];
}
export type AffiliationListItem = Pick<Affiliation, "id" | "name" | "country">;
export type AffiliationCreate = Pick<
	Affiliation,
	"name" | "country" | "address" | "postal_code" | "city"
>;

export type AffiliationUpdate = Partial<Omit<Affiliation, "id">>;
