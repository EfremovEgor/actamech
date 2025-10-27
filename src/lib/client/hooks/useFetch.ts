// hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react";
import axios, { type AxiosRequestConfig, AxiosError } from "axios";

interface UseFetchReturn<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	refetch: () => void;
}

export function useFetch<T = any>(
	url: string,
	options: AxiosRequestConfig = {},
	deps: any[] = []
): UseFetchReturn<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(() => {
		setLoading(true);
		setError(null);

		const source = axios.CancelToken.source();

		axios
			.get<T>(url, { ...options, cancelToken: source.token })
			.then((res) => setData(res.data))
			.catch((err) => {
				if (!axios.isCancel(err)) {
					setError(err.message);
				}
			})
			.finally(() => setLoading(false));

		return () => {
			source.cancel("Request canceled");
		};
	}, [url, ...deps]);

	useEffect(() => {
		const cancel = fetchData();
		return () => cancel && cancel();
	}, [fetchData]);

	return { data, loading, error, refetch: fetchData };
}
