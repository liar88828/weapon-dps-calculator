import { formatNumber } from "@/lib/formatter.ts";
import type { Weapon } from "@/store/useFormWeaponStore.ts";
import { useSettingStore } from "@/store/useSettingStore.ts";

export const fmt = (n: number, d: number = 2) => {
  return Number.isFinite(n)
    ? n.toLocaleString(undefined, { maximumFractionDigits: d })
    : "-";
};

export const _calcBaseDpsOld = (
  w: Pick<Weapon, "damage" | "fireTime" | "multiplier">,
) => {
  if (!w.fireTime || w.fireTime <= 0) return 0;
  return w.damage * (w.fireTime / 60) * (w.multiplier || 1);
};

export const calcBaseDps = (w: Pick<Weapon, "damage" | "multiplier">) => {
  return w.damage * (w.multiplier || 1);
};

export const calcCritDps = (w: Weapon) => {
  const base = calcBaseDps(w);
  const c = Math.min(Math.max(w.criticalChange ?? 0, 0), 1);
  const cm = Math.max(w.criticalMultiplier || 1, 1);
  // Expected DPS with crits: base * (1 + c * (cm - 1))
  return base * (1 + c * (cm - 1));
};

// export function calculateCriticalDamage(baseDamage: number, critChance: number, critMultiplier: number): number {
//     const normalHit = baseDamage * (1 - critChance);
//     const critHit = baseDamage * critMultiplier * critChance;
//     return normalHit + critHit; // average damage per shot
// }
//
// export function criticalHitDamage(baseDamage: number, critMultiplier: number): number {
//     return baseDamage * critMultiplier;
// }

export function getEffectiveDps(
  baseDps: number,
  numMagazine: number,
  totalCycleTime: number,
) {
  return totalCycleTime > 0 ? (baseDps * numMagazine) / totalCycleTime : 0;
}

export function getRoundsPerSecond(
  fireTime: number,
  isActive: boolean, //= false
): number {
  // console.log(`test1 : ${ 6.7 / 60 }`)
  // console.log(`test1 : ${ 1 / 6.7 }`)

  return fireTime > 0 ? fireTime / (isActive ? 60 : 1) : 0;
}

export function getMagazineTime(magazineSize: number, roundsPerSecond: number) {
  return roundsPerSecond > 0 ? magazineSize / roundsPerSecond : 0;
}

export const trueDPS = (w: Weapon, isRps: boolean) => {
  const d_mag = w.damage * w.multiplier * w.magazine;
  const mag_rel =
    w.magazine / getRoundsPerSecond(w.fireTime, isRps) + w.reloadTime;
  return d_mag / mag_rel;
};
// export const trueDPSString = (w: Weapon, rps: boolean) => {
//     return trueDPS(w, rps).toFixed(2)
// }

export const useDpsWeapon = (weapon: Weapon) => {
  const { form: setting } = useSettingStore();

  // Convert to numbers
  const numDamage = Number(weapon.damage);
  const numMultiplier = Number(weapon.multiplier);
  const numFireTime = Number(weapon.fireTime);
  const numMagazine = setting.infinityAmmo ? 1 : Number(weapon.magazine);
  const numReloadTime = setting.noReload ? 1 : Number(weapon.reloadTime);
  const numElementalDps = Number(weapon.elementalDps);

  // Shots per second
  const rps = getRoundsPerSecond(numFireTime, setting.rps);

  // 1️⃣ Normal DPS
  const normalDps = calcBaseDps({
    damage: numDamage,
    multiplier: numMultiplier,
  });
  const dMag = normalDps * numMagazine;

  // Cycle time
  const totalCycleTime = getMagazineTime(numMagazine, rps) + numReloadTime;

  // 2️⃣ Critical DPS
  // const criticalHit = calcBaseDps(weapon);
  const criticalAverage = calcCritDps(weapon);
  const criticalDps = criticalAverage * rps;

  // 3️⃣ Normal + Elemental DPS
  const normalPlusElementDps = normalDps + numElementalDps;

  // 4️⃣ Critical + Elemental DPS
  const criticalPlusElementDps = criticalDps + numElementalDps;

  // Effective DPS
  const normalDpsEffective = getEffectiveDps(
    normalDps,
    numMagazine,
    totalCycleTime,
  );
  const criticalDpsEffective = getEffectiveDps(
    criticalDps,
    numMagazine,
    totalCycleTime,
  );
  const normalPlusElementDpsEffective = getEffectiveDps(
    normalPlusElementDps,
    numMagazine,
    totalCycleTime,
  );
  const criticalPlusElementDpsEffective = getEffectiveDps(
    criticalPlusElementDps,
    numMagazine,
    totalCycleTime,
  );
  return {
    // Normal Damage
    rps: rps.toFixed(1),
    dMag: formatNumber(dMag),
    totalCycleTime: totalCycleTime.toFixed(2),
    normalDps: formatNumber(normalDps),
    normalDpsEffective: formatNumber(normalDpsEffective),
    standarDps: formatNumber(normalDps * rps),

    // With Critical
    criticalAverage: formatNumber(criticalAverage),
    criticalDps: formatNumber(criticalDps),
    criticalTotalDamagePerMag: formatNumber(criticalDps * weapon.magazine),
    criticalDpsEffective: formatNumber(criticalDpsEffective),

    // Normal + Elemental
    normalPlusElementDps: formatNumber(normalPlusElementDps),
    normalPlusElementTotalDamagePerMag: formatNumber(
      normalPlusElementDps * weapon.magazine,
    ),
    normalPlusElementDpsEffective: formatNumber(normalPlusElementDpsEffective),

    // Critical + Elemental
    criticalPlusElementDps: formatNumber(criticalPlusElementDps),
    criticalPlusElementTotalDamagePerMag: formatNumber(
      criticalPlusElementDps * weapon.magazine,
    ),
    criticalPlusElementDpsEffective: formatNumber(
      criticalPlusElementDpsEffective,
    ),
  };
};

export const useDpsWeaponBasic = (weapon: Weapon) => {
  const { form: setting } = useSettingStore();

  // Convert to numbers
  const numDamage = Number(weapon.damage);
  const numMultiplier = Number(weapon.multiplier);
  const numFireTime = Number(weapon.fireTime);
  const numElementalDps = Number(weapon.elementalDps);

  // Shots per second
  const rps = getRoundsPerSecond(numFireTime, setting.rps);

  // 1️⃣ Normal DPS
  const normalDps = calcBaseDps({
    damage: numDamage,
    multiplier: numMultiplier,
  });

  // 2️⃣ Critical DPS
  // const criticalHit = calcBaseDps(weapon);
  const criticalAverage = calcCritDps(weapon);
  const criticalDps = criticalAverage * rps;

  // 3️⃣ Normal + Elemental DPS
  const normalPlusElementDps = normalDps + numElementalDps;

  // 4️⃣ Critical + Elemental DPS
  const criticalPlusElementDps = criticalDps + numElementalDps;

  return {
    // Normal Damage
    normalDps: formatNumber(normalDps),

    // With Critical
    criticalDps: formatNumber(criticalDps),

    // Normal + Elemental
    normalPlusElementDps: formatNumber(normalPlusElementDps),

    // Critical + Elemental
    criticalPlusElementDps: formatNumber(criticalPlusElementDps),
  };
};
