import React from "react";
import type { LinkProps } from "./interfaces";

const LinkSecondarySolid = ({ text, url, className }: LinkProps) => {
	return (
		<a
			className={`rounded-base 
			bg-secondary text-secondary-text 
			py-2 px-6 block 
			text-center hover:bg-secondary-hover 
			transition-colors
			duration-150 ease-in-out
			min-w-[80px] 
			sm:min-w-[150px] ${className ?? ""}`}
			href={url}
		>
			{text}
		</a>
	);
};

export default LinkSecondarySolid;
