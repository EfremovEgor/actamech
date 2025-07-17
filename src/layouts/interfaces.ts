import type { IBreadcrumb } from "@components/types/interfaces/common";

export interface IBaseInformationPageLayout extends IBaseLayout {
  pageTitle: string;
  image: ImageMetadata;
  navigation?: IBreadcrumb;
}

export interface IBaseLayout {
  head?: IHead;
}

export interface IHead {
  title?: string;
  description?: string;
  keywords?: string;
}
