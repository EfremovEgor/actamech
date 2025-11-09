import { articleService } from "@api/services/articleService";
import type { PaginatatedSearchRequest } from "@api/types";
import PaginatedItemsTable from "@components/common/PaginatedItemsTable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/articles/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [filters, setFilters] = useState<PaginatatedSearchRequest>({
		page: 0,
		search_string: "",
	});

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["articles"],
		queryFn: async () => articleService.getArticles(filters),
	});

	const navigate = useNavigate();
	useEffect(() => {
		refetch();
	}, [filters, refetch]);
	const handleItemClick = (item: unknown) => {
		if (typeof item === "object" && item !== null && "id" in item) {
			navigate({ to: `/articles/${(item as { id: string }).id}` });
		} else {
			console.error("Invalid item:", item);
		}
	};
	const createArticle = async () => {
		const data = await articleService.createArticle();
		console.log("Created article:", data);
		navigate({ to: `/articles/${data.id}` });
	};

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	const [items, meta] = data;

	return (
		<>
			<button className="button" onClick={async () => createArticle()}>
				Create
			</button>
			<div className="mt-4">
				<PaginatedItemsTable
					{...{
						fieldsToShow: ["id", "title", "doi"],
						headers: ["Id", "Title", "DOI"],
						items,
						key: "id",
						enumerate: true,
						onClick: handleItemClick,
						onSearch: async (searchString) => {
							setFilters({
								...filters,
								...{ search_string: searchString },
							});
							await refetch();
						},
						onPageClick: async (page) => {
							setFilters({
								...filters,
								...{ page },
							});
						},
						paginationMeta: meta,
						ui: { input: { placeholder: "Title, id, DOI" } },
					}}
				/>
			</div>
		</>
	);
}
