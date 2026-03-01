import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Setting = {
  category: {
    label: string;
  }[];
  rps: boolean;
  infinityAmmo: boolean;
  noReload: boolean;
};

const defaultSetting: Setting = {
  rps: true,
  infinityAmmo: true,
  noReload: true,
  category: [
    { label: "Assault" },
    { label: "Sniper" },
    { label: "Shotgun" },
    { label: "SMG" },
    { label: "Pistol" },
  ],
};

type FormSettingState = {
  form: Setting;
  setField: <K extends keyof Setting>(field: K, value: Setting[K]) => void;
  reset: () => void;
  setForm: (setting: Setting) => void; // load an existing setting into the form
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

      setForm: (setting) => set({ form: { ...setting } }),
    }),
    {
      name: "form-setting-storage", // localStorage key
    },
  ),
);
