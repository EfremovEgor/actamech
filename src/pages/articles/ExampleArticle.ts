export type TArticleContent =
	| IText
	| ISection
	| IKeywords
	| IAbstract
	| IFigure;
export interface IArticleAuthor {
	id: string;
	fullName: string;
	description?: string;
}

export interface IText {
	type: "text";
	content: string;
}
export interface IKeywords {
	type: "keywords";
	content: string[];
}
export interface IAbstract {
	type: "abstract";
	content: string;
}

export interface ISection {
	type: "section";
	title: string;
	number?: string;
	content: TArticleContent[];
}

export interface IFigure {
	type: "figure";
	title: string;
	number?: string;
	image: string;
}

export interface ITable {
	id: string;
}

export interface IArticle {
	id: string;
	title: string;
	topic?: string;
	collectionInfo?: string;
	authors: IArticleAuthor[];
	highlights?: string[];
	doi: string;

	tables?: ITable[];
	content: TArticleContent[];
}

const article: IArticle = {
	id: "1S009457652400732X",
	collectionInfo: "volume 205, March 2025, Pages 370-383",
	topic: "Guidance Navigation & Control",
	title: "Adaptive Fault-tolerant attitude control on SO(3) under multiple attitude constraints and finite sequential actuator faults",
	tables: [
		{ id: "table1" },
		{ id: "table1" },
		{ id: "table1" },
		{ id: "table1" },
	],

	authors: [
		{ fullName: "Huiwen Zuo", id: "1" },
		{ fullName: "Qiang Shen", id: "2" },
		{ fullName: "Shangrong Ouyang", id: "3" },
		{ fullName: "Vladimir Yu. Razoumny", id: "4" },
		{ fullName: "Yury N. Razoumny", id: "5" },
		{ fullName: "Shufan Wu", id: "6" },
	],

	doi: "10.1016/j.actaastro.2024.11.062",
	highlights: [
		"Attitude reorientation under multiple constraints and finite sequential actuator faults.",
		"A hysteresis switching function helps to reduce the control chattering.",
		"An adaptive fault-tolerant controller is designed to mitigate actuator faults.",
	],
	content: [
		{
			type: "abstract",
			content:
				"The control problem of rigid body attitude redirection with attitude constraints and the fault-tolerant control problem of actuator faults have been extensively investigated individually. However, the challenge remains in addressing the rigid body attitude redirection problem under initial attitude violation constraints and a finite sequence of actuator faults. Finite sequential actuator faults can compromise system controllability or induce system instability, while violations of attitude constraints may result in equipment damage or mission failure. Therefore, this paper aims to address the spacecraft attitude redirection problem under mixed attitude constraints with arbitrary initial attitudes and a finite sequence of actuator faults. By leveraging the SO(3) framework, we establish the mathematical model for attitudes and error functions as well as define the mathematical constraint set for the mixed attitude constraint region. Additionally, we construct a potential function based on logarithmic barriers to facilitate spacecraft redirection while satisfying both forbidden and mandatory attitude constraints. Considering the initial attitude of the spacecraft being contrary to the constraints, we propose a potential function with switching characteristics to accommodate any initial attitude. Additionally, we introduce a hysteresis switching function to smoothen the switching process and minimize control chattering. To address the challenge posed by finite sequence actuator faults, an adaptive actuator fault direct compensation matrix is designed to mitigate their impact. By incorporating a logarithmic potential function into the backstepping controller, we present an arbitrary initial mixed attitude constraints adaptive fault-tolerant controller that ensures stability and effectiveness in dealing with aforementioned constraints and faults. Simulation results validate the applicability of our proposed controller for spacecraft attitude redirection tasks under mixed attitude constraints with arbitrary initial attitudes and finite sequence actuator faults. These studies not only emphasize its energy consumption efficiency but also affirm its robustness against external disturbances and measurement noise.",
		},
		{
			type: "keywords",
			content: [
				"Rigid-body reorientation on SO(3)",
				"Mixed attitude constraints with arbitrary initial attitudes",
				"Fault-tolerant control",
				"Adaptive control",
				"Finite sequential actuator faults",
			],
		},
		{
			type: "section",
			title: "Introduction",
			number: "1",
			content: [
				{
					type: "text",
					content: `Over the past few decades, the development of rigid-body attitude control systems has been instrumental in propelling advancements across a spectrum of fields, including spacecraft, aviation, and robotics. Scholars have delved into a multitude of sophisticated control algorithms tailored for nonlinear attitude control. Notable among these are adaptive control [1], [2], backstepping control [3], [4], inverse optimal control [5], [6], sliding mode control [7], [8], and fault-tolerant control [9], [10].
                                Despite significant progress, conventional control methodologies often overlook the attitude constraints inherent in real-world applications. There is a burgeoning interest in examining the maneuvering of rigid bodies within specific, scenario-driven constraints. For example, airborne optical telescopes must avoid bright fields of view to prevent damage to their sensitive instruments [11]. Similarly, the orientation of a communication antenna must remain within its beamwidth to sustain a connection with a ground station. These operational constraints on rigid-body attitudes are characterized as attitude constraints. Expanding the constraint region not only limits the permissible attitude range but also complicates the trajectory of attitude maneuvers and the control system’s complexity. In recent years, several researchers have explored the challenge of attitude maneuvering under such constraints. In [12], path planning strategies that chart a rotational trajectory meeting specific criteria are proposed. In contrast, the potential function approach simplifies computations and is amenable to on-board processing. It leverages artificial potential functions to guide the system towards attitude-conforming paths, assigning lower potential energy to the desired attitude and imposing higher potential energy barriers within constrained regions.
                                The exponential obstacle potential function, as introduced by [13], represents multiple attitude constraints based on attitude unit quaternions. Concurrently, [14] developed an attitude stabilizer that adheres to dual constraints of attitude and angular rate, facilitating spacecraft reorientation while accounting for prohibited zones and maximum angular velocities. Additionally, the concept of nullifiable potential functions, complete with a cautionary distance, was proposed by [15] to manage attitude and obstacle-avoidance limitations. The attitude controller presented by [16] represents the spacecraft’s attitude using the SO(3) group, circumventing the singularities and ambiguities associated with unit quaternion and Euler angle representations. Along these lines, [17] proposed an adaptive saturated attitude controller based on SO(3) to achieve consensus and tracking in multi-spacecraft systems under mixed constraints, even with arbitrary initial attitudes. It is important to note that while these studies have successfully managed attitude maneuvers across various regions, they have not considered the impact of actuator faults.
                                Actuator faults, which can diminish controllability or even destabilize a system [18], [19], are often neglected in the context of spacecraft attitude control under multiple constraints. The existing fault-tolerant strategies are typically divided into passive and active approaches [20]. Given the complexity and potential latency of active schemes, this paper focuses on passive fault tolerance. Scholars have proposed diverse strategies, such as 
                                theory [21], [22], Lyapunov reconstruction [23], [24], and sliding mode control [25], to achieve fault tolerance. Building on sliding mode techniques, [26] introduced an attitude controller for flexible spacecraft with redundant actuators. Furthermore, an adaptive fault-tolerant approach was employed by [27] to develop a controller that mitigates the effects of actuator faults. Additionally, [28] proposed a data-driven adaptive control method based on supervised learning to accurately predict continuous nonlinear actuator faults and model uncertainties. Lastly, [29] proposed a fault-tolerant attitude control strategy that incorporates both attitude constraints and actuator faults to ensure successful spacecraft maneuvering.
                                However, the literature is scarce regarding the simultaneous consideration of multiple attitude constraints and finite sequential actuator faults in attitude maneuvering. This paper introduces an adaptive fault-tolerant backstepping controller integrated with a potential function, adeptly addressing both challenges. The proposed controller facilitates real-time computation of the fault compensation matrix under actuator faults while ensuring the spacecraft’s attitude adheres to constraints. The system’s asymptotic stabilization is demonstrated through rigorous numerical simulations.
                                The primary contribution of this paper lies in its holistic approach to multiple attitude constraints and finite sequential actuator faults, setting it apart from prior works such as [30], [31]. Unlike these studies, which focus on either attitude constraints or actuator faults in isolation or with limited scope, our method integrates an adaptive fault-tolerant controller based on an artificial potential function for attitude constraints and an adaptive direct compensation mechanism for finite sequential actuator faults. The hybrid attitude potential function presented not only accommodates any initial attitude but also demonstrates superior gradient descent performance compared to [17]. It also effectively minimizes control chattering through the smooth hysteresis loop transition. Additionally, we provide a stability analysis grounded in Lyapunov theory to substantiate the stability of the closed-loop system.
                                The remainder of this paper is organized as follows: Section 2 outlines the kinematics of rigid body attitude using SO(3) representations. The dynamics of attitude under finite sequential actuator faults are then derived. Subsequently, the mixed attitude constraints model is described, and the research problem is stated. Section 3 introduces the potential function for mixed attitude constraints, details the design of the adaptive fault-tolerant backstepping controller, and offers a comprehensive stability analysis. Section 4 presents numerical simulation results that validate the efficacy of our proposed controller. Finally, Section 5 summarizes our conclusions.`,
				},
			],
		},
		{
			type: "section",
			number: "2",
			title: "Preliminaries",
			content: [
				{
					type: "section",
					number: "2.1",
					title: "Attitude kinematics",
					content: [
						{
							type: "text",
							content: `In the context of this study, we express the angular velocity vector 
                                        within the reference frame 
                                        , which belongs to three-dimensional space 
                                        . To facilitate this representation, we utilize a mathematical operator known as the ‘hat map’ denoted by 
                                        , which converts a three-dimensional vector from 
                                        into a 3 × 3 matrix possessing unique properties aligned with those found in mathematical structures associated with rotations specifically 
                                        [32]. Furthermore, attitude is described using an approach involving rotation angles around unit vectors 
                                        residing within two-dimensional space 
                                        . Specifically, we employ an operation referred to as ‘exponential mapping’, where our desired result 
                                        belongs to another mathematical structure known as 
                                        [33],`,
						},
						{
							type: "figure",
							number: "1",
							title: "Illustration of mixed attitude constraints.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr1.jpg",
						},
						{
							type: "section",
							number: "2.1.1",
							title: "Attitude dynamics with finite sequential actuator faults",
							content: [
								{
									type: "text",
									content: `The actuators, such as micro-thrusters and reaction wheels, typically generate the corresponding moments in response to commands. The mathematical formulation of the attitude dynamics is expressed as [34]
												(4)
												where the moment of inertia 
												, is positive definite. 
												is the control torque, while the external disturbance is indicated as 
												.
												Assumption 1

												The magnitude of the external disturbance 
												is limited by an unknown positive constant 
												, such that 
												, where 
												represents the Euclidean norm.
												The actuator typically generates the appropriate torque as instructed by the controller. However, challenges such as parameter drift and device aging give rise to actuator faults in complex operational environments. Therefore, a mathematical model is established for the output torque considering actuator faults based on previous research [35]
												(5)
												where the matrix 
												represents the actual output coefficients of the actuator under faults, where 
												for 
												. The vector 
												denotes the signal from the controller.
												The presence of finite sequential actuator faults in spacecraft attitude maneuver control is assumed in this paper, leading to a significant alteration of control gain and posing challenges for controller design. The finite sequential actuator fault characteristics the actuator fault in a form that the actuator output coefficients are fixed in the time interval 
												with 
												and 
												, and 
												is a finite constant representing the total number of fault sequences. In this fault mode, the actuator faults are serialized based on time periods. Consequently, we define 
												. Then, the output coefficients matrix 
												representing finite sequential actuator faults can be expressed as:
												(6)
												where the value of 
												is piecewise constant and eventually becomes fixed. 
												, 
												, and 
												are constants that respectively represent the output scaling parameters of the three actuators. These parameters remain fixed in the time interval 
												for 
												.
												The equations governing the attitude dynamics of a rigid-body are derived by incorporating the principles of rigid-body attitude dynamics and actuator output model in the presence of finite sequential faults, which is given by`,
								},
							],
						},
					],
				},
			],
		},
		{
			type: "section",
			number: "3",
			title: "Design and stability analysis of the controller",
			content: [
				{
					type: "text",
					content: `In this section, we introduce an approach that employs a potential function to adeptly manage arbitrary initial mixed attitude constraints. Following this, an adaptive compensation strategy is presented to effectively handle finite sequential actuator faults within rigid-body spacecraft. We have designed an arbitrary initial mixed attitude constraints adaptive fault-tolerant controller (AMAC-AFTC), this controller is specifically tailored to accommodate a variety of attitude constraints and to mitigate the effects of finite sequential actuator faults. The schematic representation of the AMAC-AFTC is depicted in Fig. 2. Finally, the Lyapunov stability theorem is utilized to analyze the effectiveness of the proposed controller and its ability to achieve the control objectives presented in Section 2.5.`,
				},
				{
					type: "section",
					number: "3.1",
					title: "Potential function design of attitude constraint",
					content: [
						{
							type: "text",
							content: `A potential function on SO(3) is proposed based on whether the spacecraft’s initial attitude 
										satisfies the mixed attitude constraints Eq. (8) or Eq. (9). The potential function 
										represents the attitude-forbidden regions, while 
										represents the attitude-mandatory regions. The potential function, denoted as 
										, is defined according to the initial attitude 
										,
										(15)
										where the mixed constraint potential function is obtained by adding two parts: the forbidden attitude constraint potential function and the mandatory attitude constraint potential function, and then adding one.`,
						},
						{
							type: "figure",
							number: "2",
							title: "Schematic of the AMAC-AFTC.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr2.jpg",
						},
						{
							type: "figure",
							number: "3",
							title: "Simulation results of initial attitude satisfying constraints. In Fig. 3(f) 2D pointing direction trajectory, azimuth is represented on the horizontal axis and pitching angle on the vertical axis. The four attitude constraint regions are visually depicted in gray color. The trajectories of the telescope’s pointing direction (TPD) and the antenna’s pointing direction (APD), controlled by AMAC-AFTC, are represented by red and green lines respectively during maneuvering. The starting attitude is denoted by a circle, while the termination attitude is indicated by a box.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr3.jpg",
						},
						{
							type: "figure",
							number: "4",
							title: "Schematic of the AMAC-AFTC.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr2.jpg",
						},
						{
							type: "figure",
							number: "5",
							title: "Simulation results of initial attitude satisfying constraints. In Fig. 3(f) 2D pointing direction trajectory, azimuth is represented on the horizontal axis and pitching angle on the vertical axis. The four attitude constraint regions are visually depicted in gray color. The trajectories of the telescope’s pointing direction (TPD) and the antenna’s pointing direction (APD), controlled by AMAC-AFTC, are represented by red and green lines respectively during maneuvering. The starting attitude is denoted by a circle, while the termination attitude is indicated by a box.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr3.jpg",
						},
						{
							type: "figure",
							number: "6",
							title: "Schematic of the AMAC-AFTC.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr2.jpg",
						},
						{
							type: "figure",
							number: "7",
							title: "Simulation results of initial attitude satisfying constraints. In Fig. 3(f) 2D pointing direction trajectory, azimuth is represented on the horizontal axis and pitching angle on the vertical axis. The four attitude constraint regions are visually depicted in gray color. The trajectories of the telescope’s pointing direction (TPD) and the antenna’s pointing direction (APD), controlled by AMAC-AFTC, are represented by red and green lines respectively during maneuvering. The starting attitude is denoted by a circle, while the termination attitude is indicated by a box.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr3.jpg",
						},
						{
							type: "figure",
							number: "8",
							title: "Schematic of the AMAC-AFTC.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr2.jpg",
						},
						{
							type: "figure",
							number: "9",
							title: "Simulation results of initial attitude satisfying constraints. In Fig. 3(f) 2D pointing direction trajectory, azimuth is represented on the horizontal axis and pitching angle on the vertical axis. The four attitude constraint regions are visually depicted in gray color. The trajectories of the telescope’s pointing direction (TPD) and the antenna’s pointing direction (APD), controlled by AMAC-AFTC, are represented by red and green lines respectively during maneuvering. The starting attitude is denoted by a circle, while the termination attitude is indicated by a box.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr3.jpg",
						},
						{
							type: "figure",
							number: "10",
							title: "Schematic of the AMAC-AFTC.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr2.jpg",
						},
						{
							type: "figure",
							number: "11",
							title: "Simulation results of initial attitude satisfying constraints. In Fig. 3(f) 2D pointing direction trajectory, azimuth is represented on the horizontal axis and pitching angle on the vertical axis. The four attitude constraint regions are visually depicted in gray color. The trajectories of the telescope’s pointing direction (TPD) and the antenna’s pointing direction (APD), controlled by AMAC-AFTC, are represented by red and green lines respectively during maneuvering. The starting attitude is denoted by a circle, while the termination attitude is indicated by a box.",
							image: "https://ars.els-cdn.com/content/image/1-s2.0-S009457652400732X-gr3.jpg",
						},
					],
				},
			],
		},
		{
			type: "section",
			title: "Conclusion",
			content: [
				{
					type: "text",
					content: `In this paper, we address the problem of spacecraft attitude redirection under mixed attitude constraints with arbitrary initial attitudes and finite sequential actuator faults. Firstly, utilizing the SO(3) framework to express the attitude and error function, we describe the mathematical constraint sets for both forbidden and mandatory attitude regions. Subsequently, a potential function with adaptable switching characteristics is constructed to reorient the spacecraft while satisfying these constraints. Additionally, a hysteresis switching function is incorporated to smoothen the switching process and reduce control chattering. Furthermore, an adaptive actuator fault direct compensation matrix is designed to mitigate challenges posed by finite sequences of actuator faults. By coupling a logarithmic potential function with a backstepping controller, an adaptive fault-tolerant controller for arbitrary initial mixed attitude constraints is proposed in order to ensure stability and effectiveness in dealing with the aforementioned constraints and faults. Simulation results validate the applicability of this proposed controller in spacecraft attitude redirection tasks under mixed attitude constraints with arbitrary initial attitudes as well as finite sequential actuator faults. Moving forward, our future research endeavors will be dedicated to developing attitude control techniques capable of adapting to parameter uncertainties within systems that encompass flexible components. Additionally, priority will be given to underactuated systems particularly susceptible to complete actuator faults aiming at augmenting resilience and dependability of spacecraft control systems in adverse conditions.`,
				},
			],
		},
	],
};
export const ARTICLES = [article];
