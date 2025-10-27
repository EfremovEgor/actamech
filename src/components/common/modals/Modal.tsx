import React from "react";
export interface Props extends React.PropsWithChildren {
	children: React.ReactElement;
	name: string;
	open?: boolean;
	onClose?: () => void;
}
const Modal = ({ children, name, onClose = () => {}, open = false }: Props) => {
	return (
		open && (
			<div
				className="fixed w-full top-0 bg-black/20 h-full left-0 flex content-center justify-center items-center"
				onClick={onClose}
			>
				<div
					className="bg-white p-4 rounded-xl"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="flex flex-row justify-between items-center gap-8">
						<h1 className="text-xl">{name}</h1>
						<button onClick={onClose} className="button">
							x
						</button>
					</div>
					<hr className="mt-2" />
					<div className="mt-4">{children}</div>
				</div>
			</div>
		)
	);
};

export default Modal;
