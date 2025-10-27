import { articleService } from "@api/services/articleService";
import type { AuthorInArticle, AuthorListItem } from "@api/types";
import FieldWrapper from "@components/common/fields/FieldWrapper";
import Modal from "@components/common/modals/Modal";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useEffect, useState } from "react";
interface Props {
	authors: AuthorInArticle[];
	articleId: string;
	onDelete: (id: string) => void;
	onAdd: (id: string) => void;
}
const AuthorsField = ({
	authors,
	onDelete = () => {},
	onAdd = () => {},
	articleId,
}: Props) => {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [authorToAdd, setAuthorToAdd] = useState<AuthorListItem[]>([]);
	const [searchString, setSearchString] = useState<string | undefined>();
	const handleDeleteAuthor = async (id: string) => {
		await articleService.removeAuthorFromArticle(articleId, [id]);
		await onDelete(id);
	};
	const handleAddAuthor = async (id: string) => {
		await articleService.addAuthorToArticle(articleId, [id]);
		await onAdd(id);
	};
	const handleFetchAuthors = async () => {
		const data = await articleService.getAvailableAuthorsToAdd(
			articleId,
			searchString
		);
		setAuthorToAdd(data[0]);
	};
	useEffect(() => {
		handleFetchAuthors();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authors]);

	return (
		<FieldWrapper name="Authors">
			<div>
				<button className="button" onClick={() => setModalIsOpen(true)}>
					Add author
				</button>
				<Modal
					open={modalIsOpen}
					onClose={() => setModalIsOpen(false)}
					name="Add author to article"
				>
					<div className="">
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
										handleFetchAuthors();
									}
								}}
							/>
							<button
								onClick={handleFetchAuthors}
								className="button"
							>
								Search
							</button>
						</div>
						<div className="flex flex-col gap-4 mt-4">
							{authorToAdd.map((author) => (
								<div className="flex flex-row gap-2 items-center justify-between">
									<p>
										{author.first_name} {author.last_name}
									</p>
									<button
										onClick={() =>
											handleAddAuthor(author.id)
										}
										className="button"
									>
										+
									</button>
								</div>
							))}
						</div>
					</div>
				</Modal>
				<div className="flex flex-col gap-2 mt-4">
					{authors.map((author, i) => (
						<div
							key={author.id}
							className="flex flex-row justify-between"
						>
							<p>
								{i + 1} {author.first_name} {author.last_name}
							</p>
							<div>
								<button
									className="cursor-pointer"
									onClick={() =>
										handleDeleteAuthor(author.id)
									}
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
			</div>
		</FieldWrapper>
	);
};

export default AuthorsField;
