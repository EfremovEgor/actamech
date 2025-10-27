import { affiliationService } from "@api/services/affiliationService";
import { articleService } from "@api/services/articleService";
import type { AffiliationUpdate } from "@api/types";
import EditableFieldInput from "@components/common/fields/EditableFieldInput";
import ConfirmationModal from "@components/common/modals/ConfirmationModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/affiliations/$affiliationId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { affiliationId } = Route.useParams();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: AffiliationUpdate }) =>
			affiliationService.updateAffiliation(id, data),
		onSuccess: (data) => {
			console.log("Affiliation updated successfully", data);
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			console.log("Update failed", error.response?.data || error.message);
		},
	});
	const navigate = useNavigate();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["affiliation", affiliationId],
		queryFn: async () =>
			await affiliationService.getAffiliation(affiliationId),
	});
	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	const handleUpdate = async (
		key: keyof AffiliationUpdate,
		value: unknown,
		doRefetch: boolean = true
	) => {
		const data: AffiliationUpdate = {
			[key]: value,
		} as unknown as AffiliationUpdate;

		try {
			await mutation.mutateAsync({ id: affiliationId, data });
			if (doRefetch) refetch();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	};

	return (
		<div>
			<h1 className="text-2xl">Article {data.name}</h1>
			<div className="mt-2 flex flex-col gap-4">
				<EditableFieldInput
					name="Name"
					submitCallback={async (value) =>
						await handleUpdate("name", value)
					}
					inputProps={{ type: "text" }}
					value={data.name}
				/>
				<EditableFieldInput
					name="Address"
					submitCallback={async (value) =>
						await handleUpdate("address", value)
					}
					inputProps={{ type: "text" }}
					value={data.address}
				/>
				<EditableFieldInput
					name="Country"
					submitCallback={async (value) =>
						await handleUpdate("country", value)
					}
					inputProps={{ type: "text" }}
					value={data.country}
				/>
				<EditableFieldInput
					name="City"
					submitCallback={async (value) =>
						await handleUpdate("city", value)
					}
					inputProps={{ type: "text" }}
					value={data.city}
				/>
				<EditableFieldInput
					name="Postal code"
					submitCallback={async (value) =>
						await handleUpdate("postal_code", value)
					}
					inputProps={{ type: "text" }}
					value={data.postal_code as string | undefined}
				/>
				<div>
					{data.clarifications.map((c) => (
						<p>{c.department}</p>
					))}
				</div>
			</div>
			<button
				onClick={() => setDeleteDialogOpen(true)}
				className="button error mt-4 w-full"
			>
				Delete
			</button>
			<ConfirmationModal
				question={`Do you really want to delete affiliation "${data.name}"?`}
				name="Confirm delete"
				onConfirm={async () => {
					await articleService.deleteArticle(data.id);
					navigate({ to: "/articles" });
				}}
				onDiscard={async () => setDeleteDialogOpen(false)}
				onClose={async () => setDeleteDialogOpen(false)}
				open={deleteDialogOpen}
			/>
		</div>
	);
}
