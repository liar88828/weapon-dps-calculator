import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Setting = {
    rps: boolean;
    time: number;
};

const defaultSetting: Setting = {
    rps: false,
    time: 0,

};

type FormSettingState = {
    form: Setting;
    setField: <K extends keyof Setting>(field: K, value: Setting[K]) => void;

    reset: () => void;
    setForm: (weapon: Setting) => void; // load an existing weapon into the form
};

export const useSettingStore = create<FormSettingState>()(
    persist(
        (set) => ({
            form: { ...defaultSetting },

            setField: (field, value) =>
                set((state) => ({
                    form: {
                        ...state.form,
                        [field]: value,
                    },
                })),

            reset: () => set({ form: { ...defaultSetting } }),

            setForm: (weapon) => set({ form: { ...weapon } }),
        }),
        {
            name: "form-setting-storage", // localStorage key
        }
    )
);