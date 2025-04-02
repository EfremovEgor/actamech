/// <reference types="astro/client" />

declare module "~icons/*" {
	// [!code ++] // [!code focus]
	import type { SVGProps } from "react"; // [!code ++] // [!code focus]
	import type React from "react"; // [!code ++] // [!code focus]
	const component: (props: SVGProps<SVGSVGElement>) => React.ReactElement; // [!code ++] // [!code focus]
	export default component; // [!code ++] // [!code focus]
} // [!code ++] // [!code focus]
