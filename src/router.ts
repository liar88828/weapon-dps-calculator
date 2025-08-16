import About from "@/components/web/about.tsx";
import Compare from "@/components/web/compare.tsx";
import Home from "@/components/web/home.tsx";
import { Layout } from "@/components/web/layout.tsx";
import { createBrowserRouter, } from "react-router";
import { loadRootData } from "./action/root-action.tsx";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            Component: Layout,
            children: [
                {
                    loader: loadRootData,
                    index: true,
                    Component: Home,
                },
                {
                    path: "compare",
                    Component: Compare,
                },
                {
                    path: "about",
                    Component: About,
                },
            ],
        },
    ],
    {
        basename: "/weapon-dps-calculator",
    }
);
