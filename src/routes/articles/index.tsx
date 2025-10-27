import { articleService } from "@api/services/articleService";
import PaginatedItemsTable from "@components/common/PaginatedItemsTable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/articles/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading } = useQuery({
		queryKey: ["articles"],
		queryFn: articleService.getArticles,
	});
	const navigate = useNavigate();

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
	const [items] = data;
	return (
		<>
			<button className="button" onClick={async () => createArticle()}>
				Create
			</button>

			<PaginatedItemsTable
				{...{
					fieldsToShow: ["id", "title", "doi"],
					headers: ["Id", "Title", "DOI"],
					items,
					key: "id",
					enumerate: true,
					onClick: handleItemClick,
				}}
			/>
		</>
	);
}
