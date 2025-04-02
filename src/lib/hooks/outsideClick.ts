import { useEffect, useRef } from "react";

export const useOutsideClick = (callback: CallableFunction) => {
	const ref = useRef<any>(null);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (
				ref.current &&
				!ref.current.contains(event.target as Node | null)
			) {
				callback();
			}
		};

		document.addEventListener("click", handleClick, true);

		return () => {
			document.removeEventListener("click", handleClick, true);
		};
	}, [ref]);

	return ref;
};
