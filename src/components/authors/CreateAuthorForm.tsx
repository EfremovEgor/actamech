import { authorService } from "@api/services/authorService";
import type { AuthorCreate } from "@api/types";
import EditableFieldInput from "@components/common/fields/EditableFieldInput";
import { useState } from "react";
interface Props {
	onSubmit: (id: string) => Promise<void>;
}
export const CreateAuthorForm = ({ onSubmit }: Props) => {
	const [createData, setCreateData] = useState<AuthorCreate>({
		first_name: "First name",
		last_name: "Last name",
	});
	const handleInputData = (key: keyof AuthorCreate, value: unknown) => {
		const data = createData;
		if (!value) delete data[key];
		else data[key] = value as string;
		console.log(data);
		setCreateData({ ...data });

		return true;
	};
	const handleSubmit = async () => {
		if (!createData.first_name || !createData.last_name) return;
		const data = await authorService.createAuthor(createData);
		onSubmit(data.id);
	};
	return (
		<div className="mt-2 flex flex-col gap-4 min-w-xl">
			<EditableFieldInput
				name="First name"
				submitCallback={async (value) =>
					handleInputData("first_name", value)
				}
				inputProps={{ type: "text" }}
				value={createData?.first_name}
			/>
			<EditableFieldInput
				name="Last name"
				submitCallback={async (value) =>
					handleInputData("last_name", value)
				}
				inputProps={{ type: "text" }}
				value={createData.last_name}
			/>

			<EditableFieldInput
				name="Middle name"
				submitCallback={async (value) =>
					handleInputData("middle_name", value)
				}
				inputProps={{ type: "text" }}
				value={createData.middle_name as string | undefined}
			/>

			<EditableFieldInput
				name="Email"
				submitCallback={async (value) =>
					handleInputData("email", value)
				}
				inputProps={{ type: "text" }}
				value={createData.email as string | undefined}
			/>

			<EditableFieldInput
				name="Orcid ID"
				submitCallback={async (value) =>
					handleInputData("orcid_id", value)
				}
				inputProps={{ type: "text" }}
				value={createData.orcid_id as string | undefined}
			/>
			<EditableFieldInput
				name="Scopus ID"
				submitCallback={async (value) =>
					handleInputData("scopus_id", value)
				}
				inputProps={{ type: "text" }}
				value={createData.scopus_id as string | undefined}
			/>
			<button onClick={handleSubmit} className="button success">
				Create
			</button>
		</div>
	);
};
