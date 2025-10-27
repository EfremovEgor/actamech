export type PartTemplate = "base" | "nocontent";

export interface BaseKnownPart {
	type: KnownPartType;
	content: string;
}

export const KnownParts = {
	funding: {
		template: "base",
		type: "funding",
		name: "Funding",
		default: {
			content: "This research received no external funding.",
		},
	},
	acknowledgement: {
		template: "base",
		type: "acknowledgement",
		name: "Acknowledgement",
		default: {
			content: "",
		},
	},
};
export type KnownPartType = keyof typeof KnownParts;

export function isKnownPartType(value: string): value is KnownPartType {
	return value in KnownParts;
}
