import type {
	BasePaginatedAPIResponse,
	PaginationReturn,
	VolumeListItem,
} from "@api/types";
import apiV1Instance from "../axios";
export const proceedingService = {
	async getVolumes(
		searchString?: string
	): Promise<PaginationReturn<VolumeListItem[]>> {
		const res = await apiV1Instance.get<
			BasePaginatedAPIResponse<VolumeListItem[]>
		>(`/proceedings/volumes`, {
			params: {
				search_string: searchString,
			},
		});
		return [res.data.data.items, res.data.data.meta];
	},
};
