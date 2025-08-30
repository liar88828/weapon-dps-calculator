import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Shared navigation */ }
            <nav className="bg-gray-100 border-b border-gray-300 p-4">
                <div className="flex gap-4">
                    <NavLink
                        to="/"
                        className={ ({ isActive }) =>
                            isActive ? "underline font-semibold" : "hover:underline"
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/compare"
                        className={ ({ isActive }) =>
                            isActive ? "underline font-semibold" : "hover:underline"
                        }
                    >
                        Compare
                    </NavLink>

                    <NavLink
                        to="/about"
                        className={ ({ isActive }) =>
                            isActive ? "underline font-semibold" : "hover:underline"
                        }
                    >
                        About
                    </NavLink>
                </div>
            </nav>

            {/* Where nested routes get rendered */ }
            <main className="flex-1 container mx-auto p-6">
                <Outlet/>
            </main>

            {/* Shared footer */ }
            <footer className="mt-auto bg-gray-200 border-t border-gray-300 p-4 text-center text-sm text-gray-600">
                © { new Date().getFullYear() } Weapon DPS Calculator — Lock, Load, Calculate!
            </footer>
        </div>
    );
}
