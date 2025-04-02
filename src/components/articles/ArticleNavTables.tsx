import React, { useState } from "react";
import type { ITable } from "src/pages/articles/ExampleArticle";
import HugeiconsWindowsNew from "~icons/hugeicons/windows-new";
const ArticleNavTables = ({ tables }: { tables: ITable[] }) => {
	return (
		<div className="border-b-border-primary border-b-1 pb-4">
			<h3 className="text-xl font-semibold mt-8">
				Tables ({tables.length})
			</h3>
			<ul className="flex flex-col gap-2 mt-4">
				{tables.map((table, i) => (
					<li>
						<span className="flex flex-row items-center font-semibold gap-1">
							<HugeiconsWindowsNew /> Table {i + 1}
						</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ArticleNavTables;
