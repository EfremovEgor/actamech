export interface IHeaderLink {
	text: string;
	url: string;
	target?: "_blank" | "_parent" | "_self" | "_top";
	external?: boolean;
}
