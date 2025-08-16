import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Weapon = {
    id: string;
    name: string;
    category: string;
    damage: number;
    magazine: number;
    fireTime: number;
    criticalChange: number;
    criticalMultiplier: number;
    reloadTime: number;
    multiplier: number;
    elementalDps: number;
};

const defaultWeapon: Weapon = {
    id: "",
    name: "",
    category: "",
    damage: 0,
    magazine: 0,
    fireTime: 0,
    criticalChange: 0,
    criticalMultiplier: 0,
    reloadTime: 0,
    multiplier: 1,
    elementalDps: 0,
};

/**
 * 🔹 Store for weapon form (single editable weapon)
 */
type FormWeaponState = {
    form: Weapon;
    setField: (field: keyof Weapon, value: string | number) => void;
    reset: () => void;
    setForm: (weapon: Weapon) => void; // load an existing weapon into the form
};

export const useFormWeaponStore = create<FormWeaponState>()(
    persist(
        (set) => ({
            form: { ...defaultWeapon },

            setField: (field, value) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        [field]:
                            typeof value === "string" &&
                            value.trim() !== "" &&
                            !isNaN(Number(value))
                                ? Number(value)
                                : value,
                    },
                })),

            reset: () => set({ form: { ...defaultWeapon } }),

            setForm: (weapon) => set({ form: { ...weapon } }),
        }),
        {
            name: "form-weapon-storage", // localStorage key
        }
    )
);