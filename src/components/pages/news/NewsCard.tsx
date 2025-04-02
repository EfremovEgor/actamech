import React, { useState } from "react";
import LucideChevronDown from "~icons/lucide/chevron-down";
export interface INewsCard {
  title: string;
  date: string;
  text: string;
  extra: string;
}

const NewsCard = ({ title, date, text, extra }: INewsCard) => {
  return (
    <div className="px-4 py-8 shadow-lg rounded p-2">
      <h1 className="text-center border-underline-2 text-xl pb-2">{title}</h1>
      <p className="text-center text-tertiary-text mt-2 text-lg">{date}</p>
      <p className="mt-4 text-justify">{text}</p>
    </div>
  );
};

export default NewsCard;
