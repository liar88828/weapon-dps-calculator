import type { Weapon } from "@/store/useFormWeaponStore.ts";

export const fmt = (n: number, d: number = 2) => {
    return (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "-")
};

export const calcBaseDps = (w: Weapon) => {
    if (!w.fireTime || w.fireTime <= 0) return 0;
    return (w.damage / w.fireTime) * (w.multiplier || 1);
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

export function getEffectiveDps(baseDps: number, numMagazine: number, totalCycleTime: number) {
    return totalCycleTime > 0 ? (baseDps * numMagazine) / totalCycleTime : 0;
}

// FIXED: if fireTime = seconds per shot
export function getRoundsPerSecond(fireTime: number): number {
    return fireTime > 0 ? 1 / fireTime : 0;
}

export function getMagazineTime(magazineSize: number, roundsPerSecond: number) {
    return roundsPerSecond > 0 ? magazineSize / roundsPerSecond : 0;
}
