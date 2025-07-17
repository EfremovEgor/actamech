import React, { useState } from "react";
import type {
  IAffiliation,
  IArticleAuthor,
} from "src/pages/articles/ExampleArticle";
import LucideChevronDown from "~icons/lucide/chevron-down";

const AuthorsAffiliations = ({ authors }: { authors: IArticleAuthor[] }) => {
  const [open, setOpen] = useState(false);
  let affilliations: IAffiliation[] = [];
  authors.forEach((author) => {
    author.affiliations?.forEach((affiliation) => {
      if (!affilliations.find((af) => af.id == affiliation.id)) {
        affilliations.push(affiliation);
      }
    });
  });
  affilliations.sort((a, b) => {
    return a.id > b.id ? 1 : 0;
  });
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="text-primary-text/40 mt-2 cursor-pointer"
      >
        {open ? "Show less" : "Show more"}
        <LucideChevronDown
          className={` ${open && "rotate-180"} transition-transform inline`}
        />
      </button>
      {open && (
        <div className="px-4 lg:px-8 text-left w-fit mx-auto lg:max-w-7/8 mt-4 pb-4 border-b-1 border-b-border-primary">
          <ul>
            {affilliations.map((affiliation) => (
              <li>
                <sup className="font-bold text-accent">{affiliation.id}</sup> -{" "}
                {affiliation.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default AuthorsAffiliations;
