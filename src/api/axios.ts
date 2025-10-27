import axios from "axios";

export const apiV1Instance = axios.create({
	baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
	timeout: 1000,
	headers: {
		"Content-Type": "application/json",
	},
});

apiV1Instance.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject(error);
	}
);

export default apiV1Instance;
