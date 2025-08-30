import type { Weapon } from "@/store/useFormWeaponStore.ts";
import { useSettingStore } from "@/store/useSettingStore.ts";

export const fmt = (n: number, d: number = 2) => {
    return (Number.isFinite(n) ? n.toLocaleString(undefined, { maximumFractionDigits: d }) : "-")
};

export const _calcBaseDpsOld = (w: Pick<Weapon, 'damage' | 'fireTime' | 'multiplier'>) => {
    if (!w.fireTime || w.fireTime <= 0) return 0;
    return (w.damage * (w.fireTime / 60)) * (w.multiplier || 1);
};

export const calcBaseDps = (w: Pick<Weapon, 'damage' | 'multiplier'>) => {
    return (w.damage * (w.multiplier || 1));
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
    return totalCycleTime > 0
        ? (baseDps * numMagazine) / totalCycleTime
        : 0;
}

export function getRoundsPerSecond(
    fireTime: number,
    isActive: boolean //= false
): number {
    // console.log(`test1 : ${ 6.7 / 60 }`)
    // console.log(`test1 : ${ 1 / 6.7 }`)

    return fireTime > 0
        ? fireTime / (isActive ? 60 : 1)
        : 0;
}

export function getMagazineTime(magazineSize: number, roundsPerSecond: number) {
    return roundsPerSecond > 0
        ? magazineSize / roundsPerSecond
        : 0;
}

export const trueDPS = (w: Weapon, rps: boolean) => {
    const d_mag = (w.damage * w.multiplier * w.magazine)
    const mag_rel = (w.magazine / getRoundsPerSecond(w.fireTime, rps)) + w.reloadTime
    return (d_mag / mag_rel)
}
// export const trueDPSString = (w: Weapon, rps: boolean) => {
//     return trueDPS(w, rps).toFixed(2)
// }

export const useDpsWeapon = (weapon: Weapon) => {
    const { form: setting, } = useSettingStore();

    // Convert to numbers
    const numDamage = Number(weapon.damage);
    const numMultiplier = Number(weapon.multiplier);
    const numFireTime = Number(weapon.fireTime);
    const numMagazine = Number(weapon.magazine);
    const numReloadTime = Number(weapon.reloadTime);
    const numElementalDps = Number(weapon.elementalDps);

    // Shots per second
    const rps = getRoundsPerSecond(numFireTime, setting.rps);
    const dMag = numDamage * numMultiplier * numMagazine

    // Cycle time
    const totalCycleTime = getMagazineTime(numMagazine, rps) + numReloadTime

    // 1️⃣ Normal DPS
    const normalDps = calcBaseDps({ damage: numDamage, multiplier: numMultiplier, })

    // 2️⃣ Critical DPS
    // const criticalHit = calcBaseDps(weapon);
    const criticalAverage = calcCritDps(weapon);
    const criticalDps = criticalAverage * rps;

    // 3️⃣ Normal + Elemental DPS
    const normalPlusElementDps = normalDps + numElementalDps;

    // 4️⃣ Critical + Elemental DPS
    const criticalPlusElementDps = criticalDps + numElementalDps;

    // Effective DPS
    const normalDpsEffective = getEffectiveDps(normalDps, numMagazine, totalCycleTime);
    const criticalDpsEffective = getEffectiveDps(criticalDps, numMagazine, totalCycleTime);
    const normalPlusElementDpsEffective = getEffectiveDps(normalPlusElementDps, numMagazine, totalCycleTime);
    const criticalPlusElementDpsEffective = getEffectiveDps(criticalPlusElementDps, numMagazine, totalCycleTime)
    return {
        // Normal Damage
        rps: rps.toFixed(2),
        dMag,
        totalCycleTime: totalCycleTime.toFixed(2),
        normalDps,
        normalDpsEffective: normalDpsEffective.toFixed(2),

        // With Critical
        criticalAverage,
        criticalDps: criticalDps.toFixed(2),
        criticalTotalDamagePerMag: (criticalDps * weapon.magazine).toFixed(2),
        criticalDpsEffective: criticalDpsEffective.toFixed(2),

        // Normal + Elemental
        normalPlusElementDps,
        normalPlusElementTotalDamagePerMag: (normalPlusElementDps * weapon.magazine),
        normalPlusElementDpsEffective: normalPlusElementDpsEffective.toFixed(2),

        // Critical + Elemental
        criticalPlusElementDps: criticalPlusElementDps.toFixed(2),
        criticalPlusElementTotalDamagePerMag: (criticalPlusElementDps * weapon.magazine).toFixed(2),
        criticalPlusElementDpsEffective: criticalPlusElementDpsEffective.toFixed(2),

    }

}