import SerialFormatting from "@components/common/SerialFormatting";
import React from "react";

const ProceedingVolume = ({
	proceedingId,
	volumeData,
	image,
}: {
	image?: string;
	proceedingId: string;
	volumeData: {
		id: string;
		title: string;
		volume_number: string;
	};
}) => {
	return (
		<a
			href={`/proceedings/${proceedingId}/${volumeData.volume_number}`}
			className="w-fit"
		>
			<div className="relative">
				<img
					src={image ?? "/images/test/example_cover.png"}
					className="h-80 w-auto mx-auto rounded-2xl"
					width="auto"
					alt={volumeData.title}
				/>
			</div>
			<div className="text-lg flex flex-col items-center mt-2 text-center">
				<p>Volume {volumeData.volume_number}</p>
				{/* <SerialFormatting str={volumeData.title} wrapper="p" /> */}
			</div>
		</a>
	);
};

export default ProceedingVolume;
