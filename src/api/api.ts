import axios from "axios";
import { apiInstance } from "./axiosInstance";
import type {
	BaseAPIResponse,
	ProceedingResponse,
	ProceedingVolumeResponse,
	SingleArticleResponse,
} from "./types";

export const baseGetFetch = async <T extends any>(
	url: string
): Promise<BaseAPIResponse<T> | null> => {
	try {
		const { data }: { data: BaseAPIResponse<T> } = await apiInstance.get(
			url
		);
		return data;
	} catch (err) {
		return null;
	}
};

export const getArticleById = async (id: string) => {
	return await baseGetFetch<SingleArticleResponse>(`/articles/${id}`);
};

export const getProceedingById = async (id: string) => {
	return await baseGetFetch<ProceedingResponse>(`/proceedings/${id}`);
};

export const getProceedingVolumeById = async (id: string) => {
	return await baseGetFetch<ProceedingVolumeResponse>(
		`/proceedings/volumes/${id}`
	);
};
