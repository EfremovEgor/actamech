import type { MouseEventHandler } from "react";

export interface ButtonProps {
	text: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
}
