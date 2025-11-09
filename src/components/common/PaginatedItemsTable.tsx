import type { PaginationMeta } from "@api/types";
import { useState, type InputHTMLAttributes } from "react";

type Renderable = string | number | boolean;

interface Props {
	headers: string[];
	fieldsToShow: string[];
	items: Record<string, unknown>[];
	dataTransformations?: Partial<
		Record<string, (value: unknown) => Renderable>
	>;
	key: string;
	paginationMeta?: PaginationMeta;
	enumerate?: boolean;
	onClick?: ((item: Record<string, unknown>) => void) | null;
	onPageClick?: (page: number) => Promise<void>;
	onSearch?: (searchString: string) => Promise<void>;
	ui?: {
		input: Pick<InputHTMLAttributes<HTMLInputElement>, "placeholder">;
	};
}

const renderValue = (value: unknown): Renderable => {
	if (
		typeof value === "string" ||
		typeof value === "number" ||
		typeof value === "boolean"
	) {
		return value;
	}
	if (value === null || value === undefined) {
		return "-";
	}
	if (Array.isArray(value)) {
		return value.join(", ");
	}
	if (typeof value === "object") {
		return JSON.stringify(value);
	}
	return String(value);
};

const PaginatedItemsTable = ({
	headers,
	fieldsToShow,
	items,
	key,
	dataTransformations = {},
	enumerate = false,
	onClick = null,
	onSearch,
	onPageClick,
	paginationMeta,
	ui = { input: {} },
}: Props) => {
	const [searchString, setSearchString] = useState<string>("");
	const handleSearch = async () => {
		if (onSearch) await onSearch(searchString);
	};
	return (
		<div className="w-fit">
			{onSearch && (
				<div className="flex flex-row gap-2">
					<input
						{...ui?.input}
						className="input w-full"
						type="text"
						onChange={(e) => setSearchString(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
					<button onClick={handleSearch} className="button">
						Search
					</button>
				</div>
			)}
			<table>
				<thead>
					<tr>
						{enumerate && <th className="text-center p-2">№</th>}
						{headers.map((header) => (
							<th className="p-2 text-left">{header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{items.map((item, i) => {
						return (
							<tr
								{...(onClick && {
									className: "cursor-pointer",
								})}
								onClick={() => onClick && onClick(item)}
								key={item[key] as string | number}
							>
								{enumerate && (
									<td className="p-2 text-center">
										{i *
											(paginationMeta
												? paginationMeta.page
												: 0) +
											1}
									</td>
								)}
								{fieldsToShow.map((field) => {
									const data = item[field];
									let result: Renderable;

									if (dataTransformations[field])
										result =
											dataTransformations[field](data);
									else result = renderValue(data);

									return <td className="p-2">{result}</td>;
								})}
							</tr>
						);
					})}
				</tbody>
			</table>

			{paginationMeta && (
				<div className="flex flex-row gap-1">
					{Array.from(
						{ length: paginationMeta.pages },
						(_, index) => (
							<button
								className="cursor-pointer p-2 bg-slate-200 rounded size-10 hover:text-white hover:bg-slate-500"
								onClick={() => {
									if (
										index != paginationMeta.page &&
										onPageClick
									)
										onPageClick(index);
								}}
								key={index + 1}
							>
								{index + 1}
							</button>
						)
					)}
				</div>
			)}
		</div>
	);
};

export default PaginatedItemsTable;
