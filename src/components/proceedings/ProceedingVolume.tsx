import React from "react";

const ProceedingVolume = ({
	proceedingId,
	volumeData,
}: {
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
			className="flex flex-col gap-2 w-fit"
		>
			<img
				src="/images/test/example_cover.png"
				className="h-80 w-fit"
				width="auto"
				height="1"
				alt=""
			/>
			<div className="font-bold text-lg flex flex-col items-center">
				<p>Vol. {volumeData.volume_number}</p>
				<p>{volumeData.title}</p>
			</div>
		</a>
	);
};

export default ProceedingVolume;
