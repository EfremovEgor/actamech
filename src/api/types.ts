export type TArticleType = "research_paper" | "conference_paper";

export interface IFundingSection {
	type: "funding";
	content: string;
}

export interface IAcknowledgementSection {
	type: "acknowledgement";
	content: string;
}

export interface BaseAPIResponse<T> {
	message: string;
	data: T;
}

export type ArticleContentType = (IFundingSection | IAcknowledgementSection)[];

export interface SingleArticleResponse {
	id: string;
	title: string;
	pages_in_volume: string;
	abstract: string;
	keywords: string[];
	editorial: boolean;
	type: TArticleType;
	doi?: string | null;
	received_at?: string | null;
	revised_at?: string | null;
	accepted_at?: string | null;
	published_at?: string | null;
	body?: ArticleContentType | null;
	volume: ArticleVolume;
	authors: AuthorInArticle[];
}

export interface ArticleVolume {
	id: string;
	title: string;
	published_at: string;
	volume_number: string;
	conference_full_name: string;
}

export interface AuthorInArticle {
	id: string;
	first_name: string;
	last_name: string;
	middle_name?: string | null;
	email?: string | null;
	scopus_id?: string | null;
	orcid_id?: string | null;
	affiliations: AffiliationInAuthor[];
}

export interface AffiliationInAuthor {
	id: string;
	name: string;
	address: string;
	country: string;
	postal_code?: string | null;
	aliases: AffiliationAliasInResponse[];
	clarifications: AffiliationClarificationInResponse[];
}

export interface AffiliationAliasInResponse {
	id: number;
	alias: string;
}

export interface AffiliationClarificationInResponse {
	id: number;
	faculty?: string | null;
	department?: string | null;
}

export interface BaseProceeding {
	id: string;
	title: string;
}

export interface ProceedingResponse extends BaseProceeding {
	volumes: {
		id: string;
		title: string;
		volume_number: string;
	}[];
}

export interface VolumeEditor {
	id: number;
	prefix?: string;
	full_name: string;
	title: string;
	institution: string;
	country: string;
}

export interface ProceedingVolumeResponse {
	id: string;
	proceeding: BaseProceeding;
	editors: VolumeEditor[];
	title: string;
	volume_number: string;
	total_pages: string;
	place: string;
	description: string;
	conference_full_name: string;
	held_at: string;
	published_at: string;
	articles: {
		id: string;
		abstract: string;
		doi: string;
		title: string;
		type: TArticleType;
		editorial: boolean;
		published_at: string;
		authors: {
			first_name: string;
			last_name: string;
		}[];
	}[];
}
