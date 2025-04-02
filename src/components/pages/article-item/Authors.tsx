import AuthorSlidePanel from "@components/authors/AuthorSlidePanel";
import React, { useState } from "react";
import type { IArticleAuthor } from "src/pages/articles/ExampleArticle";
import AuthorsAffiliations from "./AuthorsAffiliations";

const Authors = ({ authors }: { authors: IArticleAuthor[] }) => {
  const [open, setOpen] = useState(false);
  const [currentAuthor, setCurrentAuthor] = useState<IArticleAuthor | null>(
    null
  );
  const handleClick = (author: IArticleAuthor) => {
    if (author !== currentAuthor && open) {
      setCurrentAuthor(author);
      return;
    }
    setCurrentAuthor(author);
    setOpen(!open);
  };
  return (
    <>
      <p className="text-xl text-accent font-semibold mt-4 w-fit mx-auto cursor-pointer select-text">
        {authors.map((author, index) => (
          <>
            <span
              className="hover:underline"
              onClick={() => handleClick(author)}
            >
              {author.fullName}
            </span>
            {index < authors.length - 1 && ", "}
          </>
        ))}
      </p>
      {open && currentAuthor && (
        <AuthorSlidePanel
          author={currentAuthor}
          onCloseCallback={() => {
            setOpen(false);
          }}
        />
      )}
      <AuthorsAffiliations />
    </>
  );
};

export default Authors;
