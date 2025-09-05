import SettingDialog from "@/components/web/setting.tsx";
import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
    const navItems = [
        { to: "/", label: "Home" },
        { to: "/compare", label: "Compare" },
        { to: "/saved", label: "Saved" },
        { to: "/about", label: "About" },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Shared navigation */ }
            <nav className="bg-gray-100 border-b border-gray-300 p-4 flex justify-between">
                <div className="flex gap-4">
                    { navItems.map((item) => (
                    <NavLink
                        key={ item.to }
                        to={ item.to }
                        className={ ({ isActive }) =>
                            isActive ? "underline font-semibold" : "hover:underline"
                        }
                    >
                        { item.label }
                    </NavLink>
                    )) }
                </div>

                <SettingDialog/>
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
