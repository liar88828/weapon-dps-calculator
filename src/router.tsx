import { Layout } from "@/components/web/layout.tsx";
import * as React from "react";
import { type JSX, lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { loadRootData } from "./action/root-action.tsx";

// Lazy-loaded pages
const Home = lazy(() => import("@/components/web/home.tsx"));
const Compare = lazy(() => import("@/components/web/compare.tsx"));
const About = lazy(() => import("@/components/web/about.tsx"));
const ListSavedWeaponDialog = lazy(() => import("@/components/web/saved.tsx"));

// Small wrapper to handle suspense
const withSuspense = (
  Component: React.LazyExoticComponent<() => JSX.Element>,
) => (
  <Suspense fallback={<div className="p-4">Loading...</div>}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: Layout,
      children: [
        {
          loader: loadRootData,
          index: true,
          element: withSuspense(Home),
        },
        {
          path: "compare",
          element: withSuspense(Compare),
        },
        {
          path: "about",
          element: withSuspense(About),
        },
        {
          path: "saved",
          element: withSuspense(ListSavedWeaponDialog),
        },
      ],
    },
  ],
  {
    basename: "/weapon-dps-calculator",
  },
);
