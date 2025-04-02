import type { ICallForPaper } from "@components/types/interfaces/callForPapers";
import { ARTICLES } from "../articles/ExampleArticle";

export const EXAMPLE_CALLS: ICallForPaper[] = [
	{
		id: "issf2025",
		title: "6th International SciTech Space Forum",
		submissionDeadline: "31 July 2025",
		description: `This special issue highlights selected proceedings of the 6th International SciTech Space Forum 2025, held during November 2025 in Moscow, Russia (RUDN University). The papers in this special issue cover a range of topics related to planetary defense, which is defense against Earth impacts by hazardous asteroids and comets. These include  Spaceflight Mechanics, Space Systems & Technology, Planetary Defence & Near-Earth Objects, Deep Space Exploration, Earth Observations, Human Spaceflight, Space Operations & Support, Space Safety & Security, Space Materials & Structures, Space Propulsion, Space Communication & Navigation, Space Economics & Commercialization.
Papers in this special issue will include selected papers from the  6th International SciTech Space Forum 2025 and consist of a mixture of original research papers and review papers. The paper topics will include the topics covered at the Planetary Defense Conference:  Spaceflight Mechanics, Space Systems & Technology, Planetary Defence & Near-Earth Objects, Deep Space Exploration, Earth Observations, Human Spaceflight, Space Operations & Support, Space Safety & Security, Space Materials & Structures, Space Propulsion, Space Communication & Navigation, Space Economics & Commercialization.`,
		editors: [
			{
				fullName: "Yury Razoumny",
				title: "Prof.",
				country: "Russia",
				affiliation:
					"Director of Academy of Engineering, RUDN University",
			},
			{
				fullName: "Shufan Wu",
				title: "Prof.",
				country: "China",
				affiliation:
					"Professor and Director, Shanghai JiaoTong University",
			},
			{
				fullName: "Antonio Prado",
				title: "Prof.",
				country: "Brazil",
				affiliation:
					"Pro-Rector and Professor, National Institute for Space Research",
			},
			{
				fullName: "Giancarlo Genta",
				title: "Prof.",
				country: "Italy",
				affiliation: "Professor Emeritus, Politecnico di Torino",
			},
			{
				fullName: "Ravinder Rena",
				title: "Dr.",
				country: "South Africa",
				affiliation: "Professor, Durban University of Technology",
			},
			{
				fullName: "Ketan Kotecha",
				title: "Dr.",
				country: "India",
				affiliation:
					"Dean and Professor, Symbiosis Institute of Technology",
			},
		],
		articles: {
			...ARTICLES[0],
			extra: "",
		},
	},
];
