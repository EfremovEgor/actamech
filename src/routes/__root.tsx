import Footer from "@components/layout/Footer";
import Header from "@components/layout/Header";
import { createRootRoute, Outlet } from "@tanstack/react-router";
// import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
	<>
		<Header />
		<main className="container mx-auto px-2 py-4">
			<Outlet />
		</main>
		<Footer />
		{/* <TanStackRouterDevtools /> */}
	</>
);

export const Route = createRootRoute({ component: RootLayout });
