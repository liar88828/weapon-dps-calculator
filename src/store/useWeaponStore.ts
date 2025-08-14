import { create } from "zustand";
import { persist } from "zustand/middleware";

type Weapon = {
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

type WeaponState = Weapon & {
    weapons: Weapon[];
    setField: (field: keyof Weapon, value: string | number) => void;
    addWeapon: () => void;
    reset: () => void;
    removeWeapon: (id: string) => void;
    selectWeapon: (id: string) => void
};


const defaultWeapon: Weapon = {
    id: "",
    name: "",
    category: "",
    damage: 0,
    magazine: 0,
    fireTime: 0,
    criticalChange: 0,
    criticalMultiplier: 2,
    reloadTime: 0,
    multiplier: 1,
    elementalDps: 0,
};


export const useWeaponStore = create<WeaponState>()(
    persist(
        (set, get) => ({
            ...defaultWeapon,
            weapons: [],

            setField: (field, value) =>
                set((state) => ({
                    ...state,
                    [field]:
                        typeof value === "string" && value.trim() !== "" && !isNaN(Number(value))
                            ? Number(value)
                            : value
                })),

            addWeapon: () =>
                set((state) => ({
                    weapons: [
                        ...state.weapons,
                        { ...state, id: crypto.randomUUID() } // generate unique id here
                    ],
                    ...defaultWeapon
                })),

            reset: () => set(defaultWeapon),

            removeWeapon: (id: string) =>
                set((state) => ({
                    weapons: state.weapons.filter((w) => w.id !== id)
                })),

            selectWeapon: (id: string) => {
                const w = get().weapons.find((weapon) => weapon.id === id);
                if (!w) return;
                set(() => ({
                    ...w // copy weapon fields into form state
                }))
            }

        }),
        {
            name: "weapon-storage",
        }
    )
);
