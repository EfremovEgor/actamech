import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import FieldWrapper from "./FieldWrapper";
interface Props extends React.PropsWithChildren {
	children:
		| React.ReactElement<HTMLInputElement>
		| React.ReactElement<HTMLTextAreaElement>;
	editing: boolean;
	handleEditing: () => void;
	handleCancel: () => void;
	handleSubmit: () => Promise<void>;
	value: string;
	name: string;
}
const EditableFieldBase = ({
	children,
	handleCancel,
	handleEditing,
	handleSubmit,
	value,
	name,
	editing,
}: Props) => {
	return (
		<FieldWrapper name={name}>
			<div className="flex flex-row gap-2 justify-between">
				{editing ? (
					<>{children}</>
				) : (
					<p className="px-2 py-1 text-justify whitespace-pre-line">
						{value}
					</p>
				)}
				<div className="flex flex-row gap-2">
					{!editing && (
						<button
							className="cursor-pointer"
							onClick={handleEditing}
						>
							<Icon className="text-2xl" icon="mdi:edit" />
						</button>
					)}

					{editing && (
						<>
							<button
								className="cursor-pointer"
								onClick={handleSubmit}
							>
								<Icon
									className="text-2xl"
									icon="material-symbols:save"
								/>
							</button>
							<button
								className="cursor-pointer"
								onClick={handleCancel}
							>
								<Icon
									className="text-2xl"
									icon="proicons:cancel"
								/>
							</button>
						</>
					)}
				</div>
			</div>
		</FieldWrapper>
	);
};

export default EditableFieldBase;
