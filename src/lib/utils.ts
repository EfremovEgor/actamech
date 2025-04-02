export const scrollToId = (id: string) => {
	const element = document.getElementById(id);
	if (!element) return;
	const headerOffset = 100;
	const elementPosition = element.getBoundingClientRect().top;
	const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

	window.scrollTo({
		top: offsetPosition,
		behavior: "smooth",
	});
};
