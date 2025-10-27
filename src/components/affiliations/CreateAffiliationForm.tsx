import { affiliationService } from "@api/services/affiliationService";
import type { AffiliationCreate } from "@api/types";
import EditableFieldInput from "@components/common/fields/EditableFieldInput";
import { useState } from "react";
interface Props {
	onSubmit: (id: string) => Promise<void>;
}
export const CreateAffiliationForm = ({ onSubmit }: Props) => {
	const [createData, setCreateData] = useState<AffiliationCreate>({
		name: "Name",
		address: "Address",
		country: "Country",
		city: "City",
	});
	const handleInputData = (key: keyof AffiliationCreate, value: unknown) => {
		const data = createData;
		if (!value) delete data[key];
		else data[key] = value as string;
		console.log(data);
		setCreateData({ ...data });

		return true;
	};
	const handleSubmit = async () => {
		if (!createData.name || !createData.address || !createData.country)
			return;
		const data = await affiliationService.createAffiliation(createData);
		onSubmit(data.id);
	};
	return (
		<div className="mt-2 flex flex-col gap-4 min-w-xl">
			<EditableFieldInput
				name="Name"
				submitCallback={async (value) => handleInputData("name", value)}
				inputProps={{ type: "text" }}
				value={createData.name}
			/>
			<EditableFieldInput
				name="Address"
				submitCallback={async (value) =>
					handleInputData("address", value)
				}
				inputProps={{ type: "text" }}
				value={createData.address}
			/>

			<EditableFieldInput
				name="Country"
				submitCallback={async (value) =>
					handleInputData("country", value)
				}
				inputProps={{ type: "text" }}
				value={createData.country}
			/>
			<EditableFieldInput
				name="City"
				submitCallback={async (value) => handleInputData("city", value)}
				inputProps={{ type: "text" }}
				value={createData.city}
			/>
			<EditableFieldInput
				name="Postal code"
				submitCallback={async (value) =>
					handleInputData("postal_code", value)
				}
				inputProps={{ type: "text" }}
				value={createData.postal_code as string | undefined}
			/>

			<button onClick={handleSubmit} className="button success">
				Create
			</button>
		</div>
	);
};
