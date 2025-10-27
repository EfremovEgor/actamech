import { useEffect, useRef, useState, type JSX } from "react";
import EditableFieldBase from "./EditableFieldBase";

interface Props {
	inputProps: JSX.IntrinsicElements["input"];
	value: Date;
	name: string;
	submitCallback: (value: string) => Promise<boolean>;
}

function formatDateForInput(date: Date) {
	return date.toISOString().slice(0, 16);
}

function parseInputToDate(value: string) {
	const [datePart, timePart] = value.split("T");
	const [year, month, day] = datePart.split("-").map(Number);
	const [hour, minute] = timePart.split(":").map(Number);
	return new Date(year, month - 1, day, hour, minute);
}

const EditableFieldDate = ({
	inputProps,
	name,
	value: originalValue,
	submitCallback = async () => true,
}: Props) => {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(originalValue);
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
		if (value == originalValue) {
			setEditing(false);
			return;
		}
		if (await submitCallback(String(value))) {
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
				value: value.getTime() ? value.toUTCString() : "Не указано",
			}}
		>
			<input
				ref={inputRef}
				{...inputProps}
				value={formatDateForInput(value)}
				type="datetime-local"
				onChange={(e) => setValue(parseInputToDate(e.target.value))}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSubmit();
					}
				}}
				className={`w-full border-1 rounded px-2 py-1 ${error ? "border-red-600 outline-red-600" : "border-slate-800 outline-slate-800"}`}
			/>
		</EditableFieldBase>
	);
};

export default EditableFieldDate;
