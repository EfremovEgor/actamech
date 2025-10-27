import { useEffect, useRef, useState } from "react";
import EditableFieldBase from "./EditableFieldBase";
interface Props {
	checked: boolean;
	name: string;
	submitCallback: (value: boolean) => Promise<boolean>;
}
const EditableFieldCheckbox = ({
	name,
	checked: originalValue,
	submitCallback = async () => true,
}: Props) => {
	const [editing, setEditing] = useState(false);
	const [checked, setChecked] = useState(originalValue);
	const [error, setError] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
		}
	}, [editing]);
	const handleEditing = () => {
		setEditing(true);
	};
	const handleSubmit = async () => {
		if (checked == originalValue) {
			setEditing(false);
			return;
		}
		if (await submitCallback(checked)) {
			setEditing(false);
			return;
		}
		setError(true);
	};
	const handleCancel = () => {
		setChecked(originalValue);
		setEditing(false);
	};
	return (
		<EditableFieldBase
			{...{
				handleEditing,
				handleCancel,
				handleSubmit,
				editing,
				name,
				value: checked ? "True" : "False",
			}}
		>
			<input
				ref={inputRef}
				type="checkbox"
				checked={checked}
				onChange={(e) => setChecked(e.target.checked)}
				className={`w-full border-1 rounded px-2 py-1 ${error ? "border-red-600 outline-red-600" : "border-slate-800 outline-slate-800"}`}
			/>
		</EditableFieldBase>
	);
};

export default EditableFieldCheckbox;
