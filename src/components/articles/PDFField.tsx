import { articleService } from "@api/services/articleService";
import FieldWrapper from "@components/common/fields/FieldWrapper";
import { useState } from "react";
interface Props {
	articleId: string;
	onUpload: () => Promise<unknown>;
}
const PDFField = ({ articleId, onUpload }: Props) => {
	const [file, setFile] = useState<File | null>(null);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};
	const handleUpload = async () => {
		if (!file) return;
		await articleService.uploadArticlePDF(articleId, file);
		await onUpload();
	};

	return (
		<FieldWrapper name="PDF">
			<div>
				<div className="flex flex-row gap-4 justify-between">
					<input
						type="file"
						className="input"
						accept="application/pdf"
						onChange={handleFileChange}
					/>
					<button className="button" onClick={handleUpload}>
						Upload
					</button>
				</div>
				<details className=" mt-4">
					<summary>Show/Hide</summary>
					<object
						data={`${import.meta.env.VITE_API_URL}/api/v1/articles/${articleId}/pdf?download=false`}
						type="application/pdf"
						width="100%"
						height="800px"
						title="Embedded PDF Viewer"
					>
						<iframe
							src={`${import.meta.env.VITE_API_URL}/api/v1/articles/${articleId}/pdf?download=false`}
							width="100%"
							height="800px"
							style={{ border: "none" }}
							title="Fallback PDF Viewer"
						>
							<p>
								Your browser does not support PDFs.
								<a
									href={`${import.meta.env.VITE_API_URL}/api/v1/articles/${articleId}/pdf?download=true`}
									target="_blank"
									rel="noopener noreferrer"
								>
									Download PDF
								</a>
							</p>
						</iframe>
					</object>
				</details>
			</div>
		</FieldWrapper>
	);
};

export default PDFField;
