import { scrollToId } from "@lib/client/utils";
import React, { useState } from "react";
import type {
  ITable,
  TArticleContent,
} from "src/pages/articles/ExampleArticle";
import HugeiconsWindowsNew from "~icons/hugeicons/windows-new";
const ArticleNavTables = ({ content }: { content: TArticleContent[] }) => {
  const findAllFigures = (content: TArticleContent[]) => {
    let tables: ITable[] = [];
    content.forEach((element) => {
      if (element.type == "table") {
        tables.push(element);
      } else if (element.type == "section")
        tables.push(...findAllFigures(element.content));
    });
    return tables;
  };
  let tables: ITable[] = findAllFigures(content);
  return (
    <div className="border-b-border-primary border-b-1 pb-4">
      <h3 className="text-xl font-semibold mt-8">Tables ({tables.length})</h3>
      <ul className="flex flex-col gap-2 mt-4">
        {tables.map((table, i) => (
          <li>
            <button
              onClick={() => scrollToId(`table-${table.number}`)}
              className="flex flex-row items-center font-semibold gap-1"
            >
              <HugeiconsWindowsNew /> Table {i + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleNavTables;
