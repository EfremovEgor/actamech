import { affiliationService } from "@api/services/affiliationService";
import type {
	Affiliation,
	AffiliationInAuthor,
	AffiliationListItem,
} from "@api/types";
import FieldWrapper from "@components/common/fields/FieldWrapper";
import Modal from "@components/common/modals/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";

interface Props {
	affiliations: AffiliationInAuthor[];
	authorId: string;
	onDelete: (id: string) => void;
	onAdd: (id: string) => void;
}

const AffiliationField = ({
	affiliations,
	authorId,
	onDelete,
	onAdd,
}: Props) => {
	const [affiliationsToAdd, setAffiliationsToAdd] = useState<
		AffiliationListItem[]
	>([]);
	const [affiliationInspectionId, setAffiliationInspectionId] = useState<
		string | null
	>(null);
	const [affiliationInspectionData, setAffiliationInspectionData] =
		useState<Affiliation | null>(null);
	const [searchString, setSearchString] = useState<string | undefined>();

	const handleDeleteAffiliation = async (
		affiliationId: string,
		clarificationId?: number
	) => {
		await affiliationService.removeAffiliationFromAuthor(authorId, [
			{
				author_affiliation_id: affiliationId,
				affiliation_clarification_id: clarificationId,
			},
		]);
		await onDelete(affiliationId);
	};
	const handleAddAffiliation = async (
		affiliationId: string,
		clarificationId?: number
	) => {
		await affiliationService.addAffiliationToAuthor(authorId, [
			{
				author_affiliation_id: affiliationId,
				affiliation_clarification_id: clarificationId,
			},
		]);
		await onAdd(affiliationId);
	};
	const handleFetchAffiliations = async () => {
		const data = await affiliationService.getAffiliations(searchString);
		setAffiliationsToAdd(data[0]);
	};
	const handleFetchAffiliation = async (id: string) => {
		const data = await affiliationService.getAffiliation(id);
		setAffiliationInspectionData(data);
	};
	useEffect(() => {
		handleFetchAffiliations();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [affiliations]);
	useEffect(() => {
		if (affiliationInspectionId)
			handleFetchAffiliation(affiliationInspectionId);
	}, [affiliationInspectionId]);
	return (
		<FieldWrapper name="Affiliations">
			<div>
				{affiliationInspectionData && (
					<Modal
						open={affiliationInspectionId != null}
						onClose={() => setAffiliationInspectionId(null)}
						name={affiliationInspectionData!.name}
					>
						<div>
							<p>{affiliationInspectionData!.address}</p>
							<p>{affiliationInspectionData!.country}</p>
							<p>{affiliationInspectionData!.city}</p>
							<p>{affiliationInspectionData!.postal_code}</p>
							<button
								onClick={() =>
									handleAddAffiliation(
										affiliationInspectionData!.id
									)
								}
								className="button"
							>
								+
							</button>
							<div className="space-y-2">
								{affiliationInspectionData!.clarifications.map(
									(cl, i) => (
										<div className="flex flex-row justify-between items-center">
											<p>
												{i + 1}. {cl.department}{" "}
												{cl.faculty}
											</p>
											<button
												onClick={() =>
													handleAddAffiliation(
														affiliationInspectionData!
															.id,
														cl.id
													)
												}
												className="button"
											>
												+
											</button>
										</div>
									)
								)}
							</div>
						</div>
					</Modal>
				)}
				<div className="">
					<div className="flex flex-row gap-2">
						<input
							placeholder="Name, address, country"
							className="input w-full"
							type="text"
							onChange={(e) => setSearchString(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleFetchAffiliations();
								}
							}}
						/>
						<button
							onClick={handleFetchAffiliations}
							className="button"
						>
							Search
						</button>
					</div>
					<div className="flex flex-col gap-4 mt-4">
						{affiliationsToAdd.map((af) => (
							<div className="flex flex-row gap-2 items-center justify-between">
								<p>
									{af.name} {af.country}
								</p>
								<button
									onClick={() =>
										setAffiliationInspectionId(af.id)
									}
									className="button"
								>
									?
								</button>
							</div>
						))}
					</div>
				</div>
				<div className="mt-4">
					<FieldWrapper name="">
						<div className="mt-4 flex flex-col gap-4">
							{affiliations.map((af, i) => (
								<div
									key={af.id}
									className="flex flex-row justify-between"
								>
									<div>
										<p>
											{i + 1}. {af.name}
										</p>
										<p className="text-sm ml-4">
											{af.address}
										</p>
										<p className="text-sm ml-4">
											{af.clarification?.department}{" "}
											{af.clarification?.faculty}
										</p>
									</div>
									<div>
										<button
											className="cursor-pointer"
											onClick={() => {
												handleDeleteAffiliation(
													af.id,
													af.clarification?.id
												);
											}}
										>
											<Icon
												className="text-2xl"
												icon="proicons:cancel"
											/>
										</button>
									</div>
								</div>
							))}
						</div>
					</FieldWrapper>
				</div>
			</div>
		</FieldWrapper>
	);
};

export default AffiliationField;
