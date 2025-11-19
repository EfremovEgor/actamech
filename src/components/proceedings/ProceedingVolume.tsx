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
			href={`/proceedings/${proceedingId}/volumes/${volumeData.id}`}
			className="w-fit"
		>
			<div className="relative">
				<img
					src={image ?? "/images/test/example_cover.png"}
					className="h-80 w-fit"
					alt={volumeData.title}
				/>
			</div>
			<div className="text-lg flex flex-col items-center mt-2 text-center">
				<p>Volume {volumeData.volume_number}</p>
				<p>{volumeData.title}</p>
			</div>
		</a>
	);
};

export default ProceedingVolume;
