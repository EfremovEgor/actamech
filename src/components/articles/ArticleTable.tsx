import React from "react";
import type { ITable } from "src/pages/articles/ExampleArticle";

const ArticleTable = ({ table }: { table: ITable }) => {
  return (
    <div className="pt-6 pb-3">
      <div
        id={`table-${table.number}`}
        className="pb-3 border-b-1 border-b-border-primary"
      >
        <table className="table-auto w-full border-collapse">
          {table.data.rows.map((row) => (
            <tr>
              {row.cells.map((cell) => (
                <td
                  className={`${cell.style?.bold && "font-bold"} ${
                    cell.style?.italic && "italic"
                  }
                  border border-border-primary
                  px-1 py-2
                  `}
                >
                  {cell.data}
                </td>
              ))}
            </tr>
          ))}
        </table>
        <span className="mt-8 block text-lg text-center">
          Table {table.number}. {table.title}
        </span>
      </div>
    </div>
  );
};

export default ArticleTable;
