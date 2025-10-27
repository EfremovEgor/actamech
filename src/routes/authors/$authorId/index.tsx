import { authorService } from "@api/services/authorService";
import type { AuthorUpdate } from "@api/types";
import AffiliationField from "@components/authors/AffiliationField";
import EditableFieldInput from "@components/common/fields/EditableFieldInput";
import ConfirmationModal from "@components/common/modals/ConfirmationModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/authors/$authorId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { authorId } = Route.useParams();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: AuthorUpdate }) =>
			authorService.updateAuthor(id, data),
		onSuccess: (data) => {
			console.log("Article updated successfully", data);
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			console.log("Update failed", error.response?.data || error.message);
		},
	});
	const navigate = useNavigate();

	const { data, isLoading, refetch } = useQuery({
		queryKey: ["author", authorId],
		queryFn: async () => await authorService.getAuthor(authorId),
	});
	const handleUpdate = async (
		key: keyof AuthorUpdate,
		value: unknown,
		doRefetch: boolean = true
	) => {
		const data: AuthorUpdate = {
			[key]: value,
		} as unknown as AuthorUpdate;

		try {
			await mutation.mutateAsync({ id: authorId, data });
			if (doRefetch) refetch();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	};

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	return (
		<div>
			<h1 className="text-2xl">
				Author {data.last_name} {data.first_name}
			</h1>
			<div className="mt-2 flex flex-col gap-4">
				<EditableFieldInput
					name="First name"
					submitCallback={async (value) =>
						await handleUpdate("first_name", value)
					}
					inputProps={{ type: "text" }}
					value={data.first_name}
				/>

				<EditableFieldInput
					name="Last name"
					submitCallback={async (value) =>
						await handleUpdate("last_name", value)
					}
					inputProps={{ type: "text" }}
					value={data.last_name}
				/>

				<EditableFieldInput
					name="Middle name"
					submitCallback={async (value) =>
						await handleUpdate("middle_name", value)
					}
					inputProps={{ type: "text" }}
					value={data.middle_name as string | undefined}
				/>

				<EditableFieldInput
					name="Email"
					submitCallback={async (value) =>
						await handleUpdate("email", value)
					}
					inputProps={{ type: "text" }}
					value={data.email as string | undefined}
				/>

				<EditableFieldInput
					name="Scopus ID"
					submitCallback={async (value) =>
						await handleUpdate("scopus_id", value)
					}
					inputProps={{ type: "text" }}
					value={data.scopus_id as string | undefined}
				/>

				<EditableFieldInput
					name="Orcid ID"
					submitCallback={async (value) =>
						await handleUpdate("orcid_id", value)
					}
					inputProps={{ type: "text" }}
					value={data.orcid_id as string | undefined}
				/>
				<div>
					<AffiliationField
						affiliations={data.affiliations}
						authorId={data.id}
						onDelete={async () => {
							await refetch();
						}}
						onAdd={async () => {
							await refetch();
						}}
					/>
				</div>
			</div>
			<button
				onClick={() => setDeleteDialogOpen(true)}
				className="button error mt-4 w-full"
			>
				Delete
			</button>
			<ConfirmationModal
				question={`Do you really want to delete author "${data.last_name} ${data.first_name}"?`}
				name="Confirm delete"
				onConfirm={async () => {
					await authorService.deleteAuthor(data.id);
					navigate({ to: "/authors" });
				}}
				onDiscard={async () => setDeleteDialogOpen(false)}
				onClose={async () => setDeleteDialogOpen(false)}
				open={deleteDialogOpen}
			/>
		</div>
	);
}
