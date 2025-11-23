import { affiliationService } from "@api/services/affiliationService";
import type { PaginatatedSearchRequest } from "@api/types";
import { CreateAffiliationForm } from "@components/affiliations/CreateAffiliationForm";
import Modal from "@components/common/modals/Modal";
import PaginatedItemsTable from "@components/common/PaginatedItemsTable";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/affiliations/")({
	component: RouteComponent,
});

function RouteComponent() {
	const [filters, setFilters] = useState<PaginatatedSearchRequest>({
		page: 0,
		search_string: "",
	});
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const { data, isLoading, refetch } = useQuery({
		queryKey: ["affiliations"],
		queryFn: async () => affiliationService.getAffiliations(filters),
	});
	const navigate = useNavigate();
	useEffect(() => {
		refetch();
	}, [filters, refetch]);
	const handleItemClick = (item: unknown) => {
		if (typeof item === "object" && item !== null && "id" in item) {
			navigate({ to: `/affiliations/${(item as { id: string }).id}` });
		} else {
			console.error("Invalid item:", item);
		}
	};

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	const [items, meta] = data;
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
				<CreateAffiliationForm
					onSubmit={async (id) => {
						navigate({ to: `/affiliations/${id}` });
					}}
				/>
			</Modal>
			<PaginatedItemsTable
				{...{
					fieldsToShow: ["id", "name", "country"],
					headers: ["Id", "Name", "Country"],
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
		</>
	);
}
