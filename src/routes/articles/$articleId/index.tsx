import { articleService } from "@api/services/articleService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import EditableFieldInput from "@components/common/fields/EditableFieldInput";
import type { ArticleUpdate } from "@api/types";
import EditableFieldTextArea from "@components/common/fields/EditableFieldTextArea";
import EditableFieldCheckbox from "@components/common/fields/EditableFieldCheckbox";
import AuthorsField from "@components/articles/AuthorsField";
import PDFField from "@components/articles/PDFField";
import EditableFieldDate from "@components/common/fields/EditableFieldDate";
import Editor from "@components/articles/editor/Editor";
import VolumeField from "@components/articles/VolumeField";
import ConfirmationModal from "@components/common/modals/ConfirmationModal";
import { useState } from "react";

export const Route = createFileRoute("/articles/$articleId/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { articleId } = Route.useParams();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const mutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: ArticleUpdate }) =>
			articleService.updateArticle(id, data),
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
		queryKey: ["article", articleId],
		queryFn: async () => await articleService.getArticle(articleId),
	});
	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	const handleUpdate = async (
		key: keyof ArticleUpdate,
		value: unknown,
		doRefetch: boolean = true
	) => {
		const data: ArticleUpdate = {
			[key]: value,
		} as unknown as ArticleUpdate;

		try {
			await mutation.mutateAsync({ id: articleId, data });
			if (doRefetch) refetch();
			return true;
		} catch (err) {
			console.error(err);
			return false;
		}
	};

	const handleUpdateId = async (value: string) => {
		if (await handleUpdate("id", value, false)) {
			navigate({ to: `/articles/${value}` });
			return true;
		}
		return false;
	};
	return (
		<div>
			<h1 className="text-2xl">Article {data.title}</h1>
			<div className="mt-2 flex flex-col gap-4">
				<EditableFieldInput
					name="ID"
					submitCallback={async (value) =>
						await handleUpdateId(value as string)
					}
					inputProps={{ type: "text" }}
					value={data.id}
				/>
				<EditableFieldInput
					name="DOI"
					submitCallback={async (value) =>
						await handleUpdate("doi", value)
					}
					inputProps={{ type: "text" }}
					value={data.doi}
				/>
				<EditableFieldInput
					name="Title"
					submitCallback={async (value) =>
						await handleUpdate("title", value)
					}
					inputProps={{ type: "text" }}
					value={data.title}
				/>
				<EditableFieldTextArea
					name="Keywords"
					inputProps={{ placeholder: "kw1\nkw2\nkw3" }}
					value={data.keywords.join("\n")}
					submitCallback={async (value) => {
						value = String(value);
						return await handleUpdate(
							"keywords",
							value.split("\n").map((val) => val.trim())
						);
					}}
				/>
				<EditableFieldTextArea
					name="Abstract"
					submitCallback={async (value) =>
						await handleUpdate("abstract", value)
					}
					inputProps={{}}
					value={data.abstract}
				/>
				<VolumeField
					volume={data.volume}
					articleId={data.id}
					articleType={data.type}
					onSelect={async () => {
						await refetch();
					}}
				/>
				<EditableFieldInput
					name="Pages in volume"
					submitCallback={async (value) =>
						await handleUpdate("pages_in_volume", value)
					}
					inputProps={{ type: "text" }}
					value={data.pages_in_volume}
				/>
				<EditableFieldCheckbox
					name="Editorial"
					submitCallback={async (value) =>
						await handleUpdate("editorial", Boolean(value))
					}
					checked={data.editorial}
				/>
				<PDFField onUpload={refetch} articleId={data.id} />
				<AuthorsField
					onDelete={async () => {
						await refetch();
					}}
					onAdd={async () => {
						await refetch();
					}}
					articleId={data.id}
					authors={data.authors}
				/>

				<EditableFieldDate
					name="Received at"
					submitCallback={async (value) => {
						value = new Date(value).toISOString();
						return await handleUpdate("received_at", value);
					}}
					value={new Date(data.received_at)}
					inputProps={{}}
				/>

				<EditableFieldDate
					name="Revised at"
					submitCallback={async (value) => {
						value = new Date(value).toISOString();
						return await handleUpdate("revised_at", value);
					}}
					value={new Date(data.revised_at)}
					inputProps={{}}
				/>

				<EditableFieldDate
					name="Accepted at"
					submitCallback={async (value) => {
						value = new Date(value).toISOString();
						return await handleUpdate("accepted_at", value);
					}}
					value={new Date(data.accepted_at)}
					inputProps={{}}
				/>

				<EditableFieldDate
					name="Published at"
					submitCallback={async (value) => {
						value = new Date(value).toISOString();
						return await handleUpdate("published_at", value);
					}}
					value={new Date(data.published_at)}
					inputProps={{}}
				/>
				<Editor articleId={data.id} data={data.body} />
			</div>
			<button
				onClick={() => setDeleteDialogOpen(true)}
				className="button error mt-4 w-full"
			>
				Delete
			</button>
			<ConfirmationModal
				question={`Do you really want to delete article "${data.title}"?`}
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
