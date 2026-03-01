import type { Weapon } from "@/store/useFormWeaponStore";
import { WeaponCategory, WeaponName } from "@/components/web/constants/weapons";

export function randomWeapon(setData: (weapon: Weapon) => void) {
  const pick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

  const randInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randFloat = (min: number, max: number, dec = 2) =>
    Number((Math.random() * (max - min) + min).toFixed(dec));

  const names = Object.values(WeaponName);
  const categories = Object.values(WeaponCategory);

  const w: Weapon = {
    id: "",
    name: pick(names),
    category: pick(categories),
    damage: randInt(10, 200),
    magazine: randInt(1, 200),
    fireTime: randInt(60, 1200),
    criticalChange: randInt(0, 100),
    criticalMultiplier: randFloat(1, 3),
    reloadTime: randFloat(0.5, 5),
    multiplier: randFloat(1, 4),
    elementalDps: randInt(0, 300),
  };

  setData(w);
}
