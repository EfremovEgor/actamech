type Renderable = string | number | boolean;

interface Props {
	headers: string[];
	fieldsToShow: string[];
	items: Record<string, unknown>[];
	dataTransformations?: Partial<
		Record<string, (value: unknown) => Renderable>
	>;
	key: string;
	enumerate?: boolean;
	onClick?: ((item: Record<string, unknown>) => void) | null;
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
}: Props) => {
	return (
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
							{...(onClick && { className: "cursor-pointer" })}
							onClick={() => onClick && onClick(item)}
							key={item[key] as string | number}
						>
							{enumerate && (
								<td className="p-2 text-center">{i + 1}</td>
							)}
							{fieldsToShow.map((field) => {
								const data = item[field];
								let result: Renderable;

								if (dataTransformations[field])
									result = dataTransformations[field](data);
								else result = renderValue(data);

								return <td className="p-2">{result}</td>;
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default PaginatedItemsTable;
