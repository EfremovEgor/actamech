import { useQuery } from "@tanstack/react-query";
import { articleService } from "./api/services/articleService";

function App() {
	const { data, isLoading } = useQuery({
		queryKey: ["articles"],
		queryFn: articleService.getArticles,
	});
	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No data fetched</p>;
	const [items, meta] = data;
	return (
		<>
			<ul>
				{items.map((a, i) => (
					<li key={a.id}>
						{i + 1}. {a.title}
					</li>
				))}
			</ul>
			{meta && <div>1</div>}
		</>
	);
}

export default App;
