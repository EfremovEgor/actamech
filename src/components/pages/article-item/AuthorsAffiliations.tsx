import React, { useState } from "react";
import LucideChevronDown from "~icons/lucide/chevron-down";

const AuthorsAffiliations = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button
				onClick={() => setOpen(!open)}
				className="text-primary-text/40 mt-2 cursor-pointer"
			>
				{open ? "Show less" : "Show more"}
				<LucideChevronDown
					className={` ${
						open && "rotate-180"
					} transition-transform inline`}
				/>
			</button>
			{open && (
				<div className="px-4 lg:px-8 text-left w-fit mx-auto lg:max-w-7/8 mt-4 pb-4 border-b-1 border-b-border-primary">
					<ul>
						<li>
							a - School of Aeronautics and Astronautics, Shanghai
							Jiao Tong University, No. 800 Dongchuan Road,
							Minhang District, Shanghai, 200240, China
						</li>
						<li>
							b - Shanghai Research Institute of Aerospace
							Computer Technology, No. 1777 Zhongchun Road,
							Minhang District, Shanghai, 201101, China
						</li>
						<li>
							c - Peoples’ Friendship University of Russia (RUDN
							University), 6, Miklukho-Maklaya Str., Moscow,
							117198, Russian Federation
						</li>
					</ul>
				</div>
			)}
		</>
	);
};

export default AuthorsAffiliations;
