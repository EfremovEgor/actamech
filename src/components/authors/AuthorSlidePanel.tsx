import { useOutsideClick } from "@lib/client/hooks/outsideClick";
import { useEffect, useRef } from "react";
import type { IArticleAuthor } from "src/pages/articles/ExampleArticle";
import EiExternalLink from "~icons/ei/external-link";
import IconoirXmark from "~icons/iconoir/xmark";
import MaterialSymbolsMailOutline from "~icons/material-symbols/mail-outline";

const AuthorSlidePanel = ({
  author: { id, fullName, description },
  onCloseCallback,
}: {
  author: IArticleAuthor;
  onCloseCallback: CallableFunction;
}) => {
  const handleClose = () => {
    onCloseCallback();
  };

  const ref = useOutsideClick(handleClose);

  return (
    <div
      ref={ref}
      className="fixed top-0 right-0 z-20 h-full bg-primary rounded-l-base py-8 px-8 min-w-[30vw] max-w-sm text-left shadow-2xl my-4"
    >
      <div className="flex flex-row justify-between">
        <p>Author</p>
        <button className="hover-accent cursor-pointer" onClick={handleClose}>
          <IconoirXmark />
        </button>
      </div>
      <div className="pb-4 border-b-border-primary border-b-1">
        <p className="text-lg mt-8">{fullName}</p>
        <a href="/test" className="text-accent hover:underline block">
          View in Scopus
          <EiExternalLink className="inline" />
        </a>
        <a href="/test" className="text-accent hover:underline block">
          View the author's ORCID record
          <EiExternalLink className="inline" />
        </a>
        <p className="mt-4">
          Peoples’ Friendship University of Russia (RUDN University), 6,
          Miklukho-Maklaya Str., Moscow, 117198, Russian Federation
        </p>
        <div className="flex flex-col gap-8 mt-4">
          <p className="text-accent group cursor-pointer">
            <MaterialSymbolsMailOutline className="inline" />
            <span className="ml-2 group-hover:underline">
              yury.razoumny@gmail.com
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthorSlidePanel;
