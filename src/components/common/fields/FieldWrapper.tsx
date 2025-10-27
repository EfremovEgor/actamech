import React from "react";
interface Props extends React.PropsWithChildren {
	children: React.ReactElement;
	name: string;
}
const FieldWrapper = ({ children, name }: Props) => {
	return (
		<div className="flex flex-col gap-2 border rounded-xl p-2 w-full">
			{name && <p className="text-lg font-bold">{name}:</p>}
			{children}
		</div>
	);
};

export default FieldWrapper;
