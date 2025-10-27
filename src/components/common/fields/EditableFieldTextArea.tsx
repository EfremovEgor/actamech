import { useEffect, useRef, useState, type JSX } from "react";
import EditableFieldBase from "./EditableFieldBase";

interface Props {
	inputProps: JSX.IntrinsicElements["textarea"];
	value: string;
	name: string;
	submitCallback: (value: string) => Promise<boolean>;
}

const EditableFieldTextArea = ({
	inputProps,
	name,
	value: originalValue,
	submitCallback = async () => true,
}: Props) => {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(originalValue);
	const [error, setError] = useState(false);
	const inputRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		if (editing) {
			inputRef.current?.focus();
		}
	}, [editing]);
	const handleEditing = () => {
		setEditing(true);
	};
	const handleSubmit = async () => {
		if (value == originalValue) {
			setEditing(false);
			return;
		}
		if (await submitCallback(value)) {
			setEditing(false);
			return;
		}
		setError(true);
	};
	const handleCancel = () => {
		setValue(originalValue);
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
				value,
			}}
		>
			<textarea
				ref={inputRef}
				{...inputProps}
				value={value}
				rows={10}
				onChange={(e) => setValue(e.target.value)}
				className={`text-justify w-full border-1 rounded px-2 py-1 ${error ? "border-red-600 outline-red-600" : "border-slate-800 outline-slate-800"}`}
			/>
		</EditableFieldBase>
	);
};

export default EditableFieldTextArea;
