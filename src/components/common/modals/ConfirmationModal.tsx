import Modal, { type Props as BaseModalProps } from "./Modal";
interface Props extends Omit<BaseModalProps, "children"> {
	question: string;
	onConfirm: () => Promise<void>;
	onDiscard: () => Promise<void>;
}
const ConfirmationModal = ({
	onConfirm,
	onDiscard,
	question,
	...props
}: Props) => {
	return (
		<Modal {...props}>
			<>
				<h2 className="text-xl">{question}</h2>
				<div className="flex flex-row gap-4 justify-between mt-4">
					<button onClick={onConfirm} className="button success">
						Confirm
					</button>
					<button onClick={onDiscard} className="button error">
						Discard
					</button>
				</div>
			</>
		</Modal>
	);
};

export default ConfirmationModal;
