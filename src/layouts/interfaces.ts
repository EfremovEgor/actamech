export interface IBaseInformationPageLayout extends IBaseLayout {
	pageTitle: string;
	image: ImageMetadata;
}

export interface IBaseLayout {
	head?: IHead;
}

export interface IHead {
	title?: string;
	description?: string;
	keywords?: string;
}
