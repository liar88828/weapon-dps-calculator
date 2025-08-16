import type { Weapon } from "@/store/useFormWeaponStore.ts";
import { create } from "zustand/index";
import { persist } from "zustand/middleware";

/**
 * 🔹 Store for saved weapon list (persistent)
 */
type WeaponListState = {
    weapons: Weapon[];
    weapon1: Weapon | null;
    weapon2: Weapon | null;
    addWeapon: (weapon: Omit<Weapon, "id">) => void;
    removeWeapon: (id: string) => void;
    // 🔹 compare
    compareWeapons: { weapon1: Weapon | null; weapon2: Weapon | null };
    setCompareWeapons: (w1: Weapon | null, w2: Weapon | null) => void;
};

export const useWeaponListStore = create<WeaponListState>()(
    persist(
        (set) => ({
            weapons: [],
            weapon1: null,
            weapon2: null,

            addWeapon: (weapon) =>
                set((state) => ({
                    weapons: [
                        ...state.weapons,
                        { ...weapon, id: crypto.randomUUID() }, // ensure unique id
                    ],
                })),

            removeWeapon: (id) =>
                set((state) => ({
                    weapons: state.weapons.filter((w) => w.id !== id),
                })),

            // 🔹 compare
            compareWeapons: { weapon1: null, weapon2: null },
            setCompareWeapons: (w1, w2) => set({ compareWeapons: { weapon1: w1, weapon2: w2 } }),

        }),
        {
            name: "weapon-list-storage", // localStorage key
        }
    )
);
