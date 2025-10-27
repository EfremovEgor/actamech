import FieldWrapper from "@components/common/fields/FieldWrapper";
import Modal from "@components/common/modals/Modal";
import {
	isKnownPartType,
	KnownParts,
	type BaseKnownPart,
} from "@lib/articles/editor/knownParts";
import { useState } from "react";
import BaseKnownPartComponent from "./parts/BaseKnownPart";
import { articleService } from "@api/services/articleService";
import { Icon } from "@iconify/react/dist/iconify.js";
interface Props {
	articleId: string;
	data: { [key: string]: string }[];
}
const Editor = ({ articleId, data }: Props) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [body, setBody] = useState(data);
	const handleAddPart = (part: { type: string; [key: string]: string }) => {
		setBody([...body, part]);
		setModalIsOpen(false);
	};
	const handleChangePartContent = (index: number, content: string) => {
		body[index].content = content;
		setBody([...body]);
	};
	const handleSubmitBody = async () => {
		articleService.updateArticle(articleId, { body: body });
	};
	const movePartUp = (index: number) => {
		if (index === 0) return;
		const newBody = [...body];
		[newBody[index - 1], newBody[index]] = [
			newBody[index],
			newBody[index - 1],
		];
		setBody(newBody);
	};
	const removePart = (index: number) => {
		setBody(body.filter((_, i) => i !== index));
	};
	const movePartDown = (index: number) => {
		if (index === body.length - 1) return;
		const newBody = [...body];
		[newBody[index], newBody[index + 1]] = [
			newBody[index + 1],
			newBody[index],
		];
		setBody(newBody);
	};
	return (
		<FieldWrapper name="Body">
			<div>
				<Modal
					open={modalIsOpen}
					onClose={() => setModalIsOpen(false)}
					name="Add part to article body"
				>
					<div className="flex flex-col gap-2">
						{Object.entries(KnownParts).map(([k, v]) => (
							<div
								key={k}
								className="flex flex-row gap-2 items-center justify-between"
							>
								<p>{v.name}</p>
								<button
									onClick={() =>
										handleAddPart({
											type: v.type,
											...v.default,
										})
									}
									className="button"
								>
									+
								</button>
							</div>
						))}
					</div>
				</Modal>
				<div className="flex flex-col gap-4">
					{body.map((part, i) => {
						if (isKnownPartType(part.type)) {
							return (
								<div className="flex flex-row w-full items-center">
									<BaseKnownPartComponent
										submitContent={(content) =>
											handleChangePartContent(i, content)
										}
										data={part as unknown as BaseKnownPart}
									/>
									<div className="text-4xl flex flex-row">
										<div className="flex flex-col">
											<button
												onClick={() => movePartUp(i)}
											>
												<Icon icon="mdi:chevron-up" />
											</button>
											<button
												onClick={() => movePartDown(i)}
											>
												<Icon icon="mdi:chevron-down" />
											</button>
										</div>
										<button onClick={() => removePart(i)}>
											<Icon
												className="text-red-500"
												icon="mdi:delete"
											/>
										</button>
									</div>
								</div>
							);
						}
					})}
				</div>
				<div className="flex flex-row gap-2 items-center mt-8">
					<button
						className="button w-1/2"
						onClick={() => setModalIsOpen(true)}
					>
						Add Part
					</button>
					<button
						onClick={handleSubmitBody}
						className="button success  w-1/2"
					>
						Save
					</button>
				</div>
			</div>
		</FieldWrapper>
	);
};

export default Editor;
