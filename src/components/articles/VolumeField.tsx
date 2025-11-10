import { articleService } from "@api/services/articleService";
import { proceedingService } from "@api/services/proceedingService";
import type { ArticleType, VolumeInArticle, VolumeListItem } from "@api/types";
import FieldWrapper from "@components/common/fields/FieldWrapper";
import Modal from "@components/common/modals/Modal";
import { useEffect, useState } from "react";
interface Props {
	volume?: VolumeInArticle;
	articleId: string;
	articleType: ArticleType;
	onSelect: (id: string) => void;
}
const VolumeField = ({ volume, onSelect = () => {}, articleId }: Props) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [volumeToSelect, setVolumeToSelect] = useState<VolumeListItem[]>([]);
	const [searchString, setSearchString] = useState<string | undefined>();
	const handleSelectVolume = async (id: string) => {
		await articleService.updateArticle(articleId, { volume_id: id });
		await onSelect(id);
	};

	const handleFetchVolumes = async () => {
		const service = proceedingService;

		const data = await service.getVolumes(searchString);
		setVolumeToSelect(data[0]);
	};
	useEffect(() => {
		handleFetchVolumes();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [volume]);

	return (
		<FieldWrapper name="Volume">
			<div>
				<button className="button" onClick={() => setModalIsOpen(true)}>
					Select volume
				</button>
				<Modal
					open={modalIsOpen}
					onClose={() => setModalIsOpen(false)}
					name="Add author to article"
				>
					<div>
						<div className="flex flex-row gap-2">
							<input
								placeholder="First name, last name, email"
								className="input min-w-64"
								type="text"
								onChange={(e) =>
									setSearchString(e.target.value)
								}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										handleFetchVolumes();
									}
								}}
							/>
							<button
								onClick={handleFetchVolumes}
								className="button"
							>
								Search
							</button>
						</div>
						<div className="flex flex-col gap-4 mt-4">
							{volumeToSelect.map((vol) => (
								<div className="flex flex-row gap-2 items-center justify-between">
									<p>
										{vol.title} #{vol.volume_number}
									</p>
									{(!volume ||
										(volume && volume.id !== vol.id)) && (
										<button
											onClick={() =>
												handleSelectVolume(vol.id)
											}
											className="button"
										>
											+
										</button>
									)}
								</div>
							))}
						</div>
					</div>
				</Modal>
				<div>
					{volume
						? `${volume.title} ${volume.volume_number} ${new Date(volume.published_at).toLocaleString()}`
						: "No volume"}
				</div>
			</div>
		</FieldWrapper>
	);
};

export default VolumeField;
