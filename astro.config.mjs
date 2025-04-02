// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

import Icons from "unplugin-icons/vite";
import react from "@astrojs/react";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	integrations: [react()],
	site: "https://actamech.com",

	build: {
		assets: "static",
	},

	vite: {
		plugins: [
			tailwindcss(),
			// Icons({
			//     compiler: "astro",
			//     autoInstall: true,
			// }),
			Icons({
				jsx: "react",
				compiler: "jsx",
				autoInstall: true,
			}),
		],
	},
	server: {
		allowedHosts: ["actamech.com", "actamech"],
	},
	adapter: node({
		mode: "standalone",
	}),
});
