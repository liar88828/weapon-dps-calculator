import { create } from "zustand";
import { persist } from "zustand/middleware";

type SortOrder = "asc" | "desc" | "";
type NameSort = "asc" | "desc";

interface WeaponFilterState {
    searchTerm: string;
    categoryFilter: string;
    shortNameSort: NameSort;
    minDps: string;
    maxDps: string;
    sortOrder: SortOrder;

    setSearchTerm: (val: string) => void;
    setCategoryFilter: (val: string) => void;
    setShortNameSort: (val: NameSort) => void;
    setMinDps: (val: string) => void;
    setMaxDps: (val: string) => void;
    setSortOrder: (val: SortOrder) => void;

    resetFilters: () => void;
}

export const useWeaponFilterStore = create<WeaponFilterState>()(
    persist(
        (set) => ({
            searchTerm: "",
            categoryFilter: "",
            shortNameSort: "asc",
            minDps: "",
            maxDps: "",
            sortOrder: "",

            setSearchTerm: (val) => set({ searchTerm: val }),
            setCategoryFilter: (val) => set({ categoryFilter: val }),
            setShortNameSort: (val) => set({ shortNameSort: val }),
            setMinDps: (val) => set({ minDps: val }),
            setMaxDps: (val) => set({ maxDps: val }),
            setSortOrder: (val) => set({ sortOrder: val }),

            resetFilters: () =>
                set({
                    searchTerm: "",
                    categoryFilter: "",
                    shortNameSort: "asc",
                    minDps: "",
                    maxDps: "",
                    sortOrder: "",
                }),
        }),
        {
            name: "weapon-filter-storage", // key in localStorage
        }
    )
);