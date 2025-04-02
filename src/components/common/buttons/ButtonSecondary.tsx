import React from "react";
import type { ButtonProps } from "./interfaces";

const ButtonSecondary = ({ text, onClick = () => {} }: ButtonProps) => {
	return <button onClick={onClick}>{text}</button>;
};

export default ButtonSecondary;
