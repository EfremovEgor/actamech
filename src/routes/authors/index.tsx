// import { articleService } from "@api/services/articleService";
import { authorService } from "@api/services/authorService";
import { CreateAuthorForm } from "@components/authors/CreateAuthorForm";
import Modal from "@components/common/modals/Modal";
import PaginatedItemsTable from "@components/common/PaginatedItemsTable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/authors/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const { data, isLoading } = useQuery({
		queryKey: ["authors"],
		queryFn: async () => authorService.getAuthors(),
	});
	const navigate = useNavigate();

	const handleItemClick = (item: unknown) => {
		if (typeof item === "object" && item !== null && "id" in item) {
			navigate({ to: `/authors/${(item as { id: string }).id}` });
		} else {
			console.error("Invalid item:", item);
		}
	};

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	const [items] = data;
	return (
		<>
			<button className="button" onClick={() => setModalIsOpen(true)}>
				Create
			</button>
			<Modal
				open={modalIsOpen}
				onClose={() => setModalIsOpen(false)}
				name="Add author"
			>
				<CreateAuthorForm
					onSubmit={async (id) => {
						navigate({ to: `/authors/${id}` });
					}}
				/>
			</Modal>
			<PaginatedItemsTable
				{...{
					fieldsToShow: ["id", "first_name", "last_name"],
					headers: ["Id", "First name", "Last name"],
					items,
					key: "id",
					enumerate: true,
					onClick: handleItemClick,
				}}
			/>
		</>
	);
}
