import { Link } from "@tanstack/react-router";

const Header = () => {
	return (
		<header className="container mx-auto py-2 px-2">
			<nav>
				<ol className="flex flex-row gap-4">
					<li>
						<Link to="/about" className="[&.active]:font-bold">
							Home
						</Link>
					</li>
					<li>
						<Link to="/articles" className="[&.active]:font-bold">
							Articles
						</Link>
					</li>
					<li>
						<Link to="/authors" className="[&.active]:font-bold">
							Authors
						</Link>
					</li>
					<li>
						<Link
							to="/affiliations"
							className="[&.active]:font-bold"
						>
							Affiliations
						</Link>
					</li>
					<li></li>
				</ol>
			</nav>
		</header>
	);
};

export default Header;
