import React, { useState } from "react";
import type {
  IArticle,
  TArticleContent,
} from "src/pages/articles/ExampleArticle";
import ArticleNavFigures from "./ArticleNavFigures";
import ArticleNavTables from "./ArticleNavTables";
import { scrollToId } from "@lib/client/utils";
const ArticleNav = ({ article }: { article: IArticle }) => {
  const [expanded, setExpanded] = useState(false);

  const handleArticleContentRender = (content: TArticleContent) => {
    switch (content.type) {
      case "section":
        return (
          <li key={content.number}>
            <span
              className="cursor-pointer"
              onClick={() => scrollToId(content.number + content.title)}
            >
              {content.number && `${content.number}. `}
              {content.title}
            </span>

            {expanded && generateTableOfContents(content.content, true)}
          </li>
        );
      case "keywords":
        return (
          <li
            key="Keywords"
            className="cursor-pointer"
            onClick={() => scrollToId("keywords")}
          >
            Keywords
          </li>
        );
      case "abstract":
        return (
          <li
            key="Abstract"
            className="cursor-pointer"
            onClick={() => scrollToId("abstract")}
          >
            Abstract
          </li>
        );
      default:
        break;
    }
    return;
  };

  const generateTableOfContents = (
    contents: TArticleContent[],
    inner: boolean = false
  ) => {
    return (
      <ul {...(inner && { className: "ml-4" })}>
        {contents.map((content) => handleArticleContentRender(content))}
        {!inner && (
          <li
            key="References"
            className="cursor-pointer"
            onClick={() => scrollToId("references")}
          >
            References
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="article-navigation">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-t-base p-2 bg-secondary/5 border-b-2 border-b-accent text-center hover:bg-accent cursor-pointer hover:text-secondary-text">
          View PDF
        </div>
        <div className="rounded-t-base p-2 bg-secondary/5 border-b-2 border-b-accent text-center hover:bg-accent cursor-pointer hover:text-secondary-text">
          Download full issue
        </div>
      </div>
      <div className="border-b-border-primary border-b-1 pb-4  mt-8">
        <h3 className="text-xl font-semibold">Outline</h3>
        <section className="mt-4">
          {generateTableOfContents(article.content)}
        </section>
        <button
          className="cursor-pointer mt-4 text-primary-text/40 font-semibold"
          onClick={() => {
            setExpanded(!expanded);
          }}
        >
          {expanded ? "Hide full outline" : "Show full outline"}
        </button>
      </div>
      <ArticleNavFigures content={article.content} />
      <ArticleNavTables content={article.content} />
    </div>
  );
};

export default ArticleNav;
