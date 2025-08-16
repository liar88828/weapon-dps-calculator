"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTitle } from "@/hook/useTitle.ts";
import { calcBaseDps, calcCritDps, fmt } from "@/lib/calculate-weapon.ts";
import type { Weapon } from "@/store/useFormWeaponStore.ts";
import { useWeaponFilterStore } from "@/store/useWeaponFilterStore";
import { useWeaponListStore } from "@/store/useWeaponListStore";
import { motion } from "framer-motion";
import {
    ArrowDownIcon,
    ArrowUpIcon,
    BaggageClaim,
    Bolt,
    Clock,
    Gauge,
    Music4Icon,
    Package2,
    RefreshCcw,
    Swords
} from "lucide-react";
import * as React from "react";
import { Link } from "react-router-dom";

export default function Compare() {
    useTitle('Compare Weapon')
    const { compareWeapons, setCompareWeapons } = useWeaponListStore();

    return (<div>
            <div className="space-y-2">
                <WeaponCard weapon={ compareWeapons.weapon1 }
                            onRemove={ () => setCompareWeapons(null, compareWeapons.weapon2) }
                            isWeapon1={ true }/>
                <WeaponCard weapon={ compareWeapons.weapon2 }
                            onRemove={ () => setCompareWeapons(compareWeapons.weapon1, null) }
                            isWeapon1={ false }/>
                <WeaponCardCompare
                    onSwap={ () => setCompareWeapons(compareWeapons.weapon2, compareWeapons.weapon1) }
                    isWeapon1={ false }
                    weapon1={ compareWeapons.weapon1 }
                    weapon2={ compareWeapons.weapon2 }
                />
            </div>
        </div>
    );
}

export function ListSavedWeaponDialog({ isWeapon1 }: { isWeapon1: boolean }) {
    const { weapons, compareWeapons, removeWeapon, setCompareWeapons } = useWeaponListStore();

    const {
        searchTerm,
        categoryFilter,
        shortNameSort,
        minDps,
        maxDps,
        sortOrder,
        setSearchTerm,
        setCategoryFilter,
        setShortNameSort,
        setMinDps,
        setMaxDps,
        setSortOrder,
        resetFilters,
    } = useWeaponFilterStore();

    const filteredWeapons = weapons
    .filter((w) => {

        // exclude already selected weapons in compareWeapons
        const isSelected =
            (compareWeapons.weapon1 && w.id === compareWeapons.weapon1.id) ||
            (compareWeapons.weapon2 && w.id === compareWeapons.weapon2.id);

        if (isSelected) return false; // skip selected ones

        const matchesName = w.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter
            ? w.category.toLowerCase() === categoryFilter.toLowerCase()
            : true;

        const dps = w.fireTime > 0 ? (w.damage * w.multiplier) / w.fireTime : 0;
        const matchesMinDps = minDps ? dps >= Number(minDps) : true;
        const matchesMaxDps = maxDps ? dps <= Number(maxDps) : true;

        return matchesName && matchesCategory && matchesMinDps && matchesMaxDps;
    })
    .sort((a, b) => {
        if (sortOrder) {
            const dpsA = a.fireTime > 0 ? (a.damage * a.multiplier) / a.fireTime : 0;
            const dpsB = b.fireTime > 0 ? (b.damage * b.multiplier) / b.fireTime : 0;
            return sortOrder === "asc" ? dpsA - dpsB : dpsB - dpsA;
        }
        return shortNameSort === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Select Weapons</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-5xl w-full">
                <DialogHeader>
                    <DialogTitle>Saved Weapons</DialogTitle>
                    <div className="grid col-span-2 gap-2">

                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={ searchTerm }
                            onChange={ (e) => setSearchTerm(e.target.value) }
                            className="border rounded p-2 flex-1"
                        />
                        <div className="flex gap-2">

                            {/* Short Name + Category */ }
                            <div className="flex gap-2">
                                <select
                                    value={ shortNameSort }
                                    onChange={ (e) => setShortNameSort(e.target.value as "asc" | "desc") }
                                    className="border rounded "
                                >
                                    <option value="asc">name A → Z</option>
                                    <option value="desc">name Z → A</option>
                                </select>

                                <select
                                    value={ categoryFilter }
                                    onChange={ (e) => setCategoryFilter(e.target.value) }
                                    className="border rounded p-2"
                                >
                                    <option value="">All Categories</option>
                                    { [ ...new Set(weapons.map((w) => w.category)) ].map((cat) => (
                                        <option key={ cat } value={ cat }>
                                            { cat }
                                        </option>
                                    )) }
                                </select>
                            </div>
                        </div>

                        {/* DPS Range + DPS Sort */ }
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min DPS"
                                value={ minDps }
                                onChange={ (e) => setMinDps(e.target.value) }
                                className="border rounded p-2 w-28"
                            />
                            <input
                                type="number"
                                placeholder="Max DPS"
                                value={ maxDps }
                                onChange={ (e) => setMaxDps(e.target.value) }
                                className="border rounded p-2 w-28"
                            />

                            <select
                                value={ sortOrder }
                                onChange={ (e) => setSortOrder(e.target.value as "asc" | "desc" | "") }
                                className="border rounded p-2"
                            >
                                <option value="">DPS Sort</option>
                                <option value="asc">Sort DPS ↑</option>
                                <option value="desc">Sort DPS ↓</option>
                            </select>
                        </div>

                        {/* 🔹 Reset Button */ }
                        <Button
                            variant="outline"
                            onClick={ resetFilters }
                        >
                            Reset
                        </Button>
                    </div>
                </DialogHeader>
                <div className={ 'h-96 overflow-y-scroll' }>

                { weapons.length > 0 ? (
                    <Card>
                        <CardContent className="space-y-2">
                            { filteredWeapons.map((w) => {
                                const dps =
                                    w.fireTime > 0 ? (w.damage * w.multiplier) / w.fireTime : 0;
                                return (
                                    <div
                                        key={ w.id }
                                        className="flex justify-between items-center border-b pb-1"
                                    >
                                        <div className="sm:text-sm text-sm">
                                            <p className="font-bold">
                                                { w.name } ({ w.category })
                                            </p>
                                            <p>
                                                { w.damage } x { w.multiplier } dmg - ({ dps.toFixed(2) } DPS)
                                            </p>
                                            <p>
                                                { w.fireTime } FT - { w.magazine } mag
                                            </p>
                                        </div>
                                        <div className="flex gap-2 flex-col">
                                            <DialogClose asChild>
                                                <Button size="sm"
                                                        onClick={ () => {
                                                            if (isWeapon1) {
                                                                setCompareWeapons(w, compareWeapons.weapon2)
                                                            } else {
                                                                setCompareWeapons(compareWeapons.weapon1, w)
                                                            }
                                                        }
                                                        }>
                                                    Weapon { isWeapon1 ? '1' : '2' }
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={ () => removeWeapon(w.id) }
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                );
                            }) }
                        </CardContent>
                    </Card>
                ) : (
                    <p className="text-muted-foreground">No saved weapons.</p>
                ) }
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function WeaponCard(
    { weapon, onSelect, onRemove, selected, actionsSlot, isWeapon1 }:
    {
        weapon: Weapon | null;
        onSelect?: (weapon: Weapon) => void;
        onRemove?: () => void;
        selected?: boolean;
        actionsSlot?: React.ReactNode;
        isWeapon1: boolean,
    }) {
    // const { weapons, compareWeapons, removeWeapon, setCompareWeapons } = useWeaponListStore();

    if (!weapon) {
        return <Card>
            <CardHeader>
                <CardTitle>Please Add Weapon { isWeapon1 ? '1' : '2' }</CardTitle>
                <CardDescription>You not select a weapon, or create first in <Link to="/" className="hover:underline">
                    Home
                </Link> page </CardDescription>
            </CardHeader>
            <CardFooter>
                <ListSavedWeaponDialog isWeapon1={ isWeapon1 }/>
            </CardFooter>
        </Card>
    }

    const baseDps = calcBaseDps(weapon);
    const critDps = calcCritDps(weapon);

    return (
        <TooltipProvider>
            <motion.div
                initial={ { opacity: 0, y: 8 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.18 } }
                className="h-full"
            >
                <Card
                    className={ `h-full overflow-hidden transition-shadow ${ selected ? "ring-2 ring-primary" : "hover:shadow-lg" }` }>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Swords className="size-5"/> { weapon.name }
                            </CardTitle>
                            <Badge variant="secondary"
                                   className="rounded-full px-3 py-1 text-xs">{ weapon.category }</Badge>
                        </div>
                        <CardDescription>ID: { weapon.id }</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* DPS Row */ }
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <StatTile icon={ <Gauge className="size-4"/> } label="Base DPS" value={ fmt(baseDps) }
                                      hint="damage / fireTime × multiplier"/>
                            <StatTile icon={ <Bolt className="size-4"/> } label="Crit DPS" value={ fmt(critDps) }
                                      hint="Base DPS × (1 + critChance × (critMult − 1))"/>
                            <StatTile icon={ <Bolt className="size-4"/> } label="Elem. DPS"
                                      value={ fmt(weapon.elementalDps) } hint="Elemental damage per second from procs"/>
                        </div>

                        <Separator/>

                        {/* Core stats */ }
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <TinyStat icon={ <Package2 className="size-4"/> } label="Damage"
                                      value={ fmt(weapon.damage) }/>
                            <TinyStat icon={ <BaggageClaim className="size-4"/> } label="Magazine"
                                      value={ fmt(weapon.magazine, 0) }/>
                            <TinyStat icon={ <Clock className="size-4"/> } label="Fire Time (s)"
                                      value={ fmt(weapon.fireTime, 2) }/>
                            <TinyStat icon={ <RefreshCcw className="size-4"/> } label="Reload (s)"
                                      value={ fmt(weapon.reloadTime, 2) }/>
                            <TinyStat icon={ <Bolt className="size-4"/> } label="Crit Chance"
                                      value={ `${ fmt((weapon.criticalChange ?? 0) * 100, 1) }%` }/>
                            <TinyStat icon={ <Bolt className="size-4"/> } label="Crit Mult"
                                      value={ `${ fmt(weapon.criticalMultiplier, 2) }×` }/>
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Badge className="rounded-full"
                                   variant="outline">x{ fmt(weapon.multiplier, 2) } mult</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            { actionsSlot }
                            { onSelect && (
                                <Button size="sm" onClick={ () => onSelect(weapon) }
                                        variant={ selected ? "default" : "secondary" }>
                                    { selected ? "Selected" : "Select" }
                                </Button>
                            ) }

                            { onRemove && (
                                <Button size="sm" variant="destructive" onClick={ onRemove }>
                                    Remove
                                </Button>
                            ) }
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </TooltipProvider>
    );
}

export function WeaponCardCompare(
    {
        weapon1,
        weapon2,
        onSelect, onSwap, selected, actionsSlot,
    }: {
        weapon1: Weapon | null;
        weapon2: Weapon | null;
        onSelect?: (weapon: Weapon) => void;
        onSwap?: () => void;
        selected?: boolean;
        actionsSlot?: React.ReactNode; // custom actions if needed,
        isWeapon1: boolean,
    }) {

    if (!weapon1) {
        return <Card>
            <CardHeader>
                <CardTitle>Please Add Weapon</CardTitle>
                <CardDescription>You not select a weapon, or create first in <Link to="/" className="hover:underline">
                    Home
                </Link> page </CardDescription>
            </CardHeader>
        </Card>
    }
    const baseDps1 = calcBaseDps(weapon1);
    const critDps1 = calcCritDps(weapon1);

    if (!weapon2) {
        return <Card>
            <CardHeader>
                <CardTitle>Please Add Weapon</CardTitle>
                <CardDescription>You not select a weapon, or create first in
                    <Link to="/" className="hover:underline">
                        Home
                    </Link>
                    page </CardDescription>
            </CardHeader>
        </Card>
    }
    const baseDps2 = calcBaseDps(weapon2);
    const critDps2 = calcCritDps(weapon2);

    return (
        <TooltipProvider>
            <motion.div
                initial={ { opacity: 0, y: 8 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.18 } }
                className="h-full"
            >
                <Card
                    className={ `h-full overflow-hidden transition-shadow ${ selected ? "ring-2 ring-primary" : "hover:shadow-lg" }` }>
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Swords className="size-5"/>
                                <div>
                                    <p className="text-red-400">{ weapon1.name }</p>
                                    <p className="text-blue-300">{ weapon2.name }</p>
                                </div>
                            </CardTitle>
                            <Badge variant="secondary"
                                   className="rounded-full px-3 py-1 text-xs">{ weapon1.category } | { weapon2.category }</Badge>
                        </div>
                        <div>
                            <CardDescription className={ 'text-red-400' }>ID: { weapon1.id }</CardDescription>
                            <CardDescription className={ "text-blue-400" }>ID: { weapon2.id }</CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* DPS Row */ }
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                            <StatTileCompare icon={ <Gauge className="size-4"/> } label="Base DPS"
                                             hint="damage / fireTime × multiplier"
                                             value1={ fmt(baseDps1) }
                                             value2={ fmt(baseDps2) }
                            />
                            <StatTileCompare icon={ <Bolt className="size-4"/> } label="Crit DPS"
                                             hint="Base DPS × (1 + critChance × (critMult − 1))"
                                             value1={ fmt(critDps1) }
                                             value2={ fmt(critDps2) }
                            />
                            <StatTileCompare icon={ <Bolt className="size-4"/> } label="Elem. DPS"
                                             hint="Elemental damage per second from procs"
                                             value1={ fmt(weapon1.elementalDps) }
                                             value2={ fmt(weapon2.elementalDps) }
                            />
                        </div>

                        <Separator/>

                        {/* Core stats */ }
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <TinyStatCompare icon={ <Package2 className="size-4"/> } label="Damage"
                                             value1={ fmt(weapon1.damage) }
                                             value2={ fmt(weapon2.damage) }
                            />
                            <TinyStatCompare icon={ <Music4Icon className="size-4"/> } label="Magazine"
                                             value1={ fmt(weapon1.magazine, 0) }
                                             value2={ fmt(weapon2.magazine, 0) }
                            />
                            <TinyStatCompare icon={ <Clock className="size-4"/> } label="Fire Time (s)"
                                             value1={ fmt(weapon1.fireTime, 2) }
                                             value2={ fmt(weapon2.fireTime, 2) }
                            />
                            <TinyStatCompare icon={ <RefreshCcw className="size-4"/> } label="Reload (s)"
                                             value1={ fmt(weapon1.reloadTime, 2) }
                                             value2={ fmt(weapon2.reloadTime, 2) }
                            />
                            <TinyStatCompare icon={ <Bolt className="size-4"/> } label="Crit Chance"
                                             value1={ `${ fmt((weapon1.criticalChange ?? 0) * 100, 1) }%` }
                                             value2={ `${ fmt((weapon2.criticalChange ?? 0) * 100, 1) }%` }
                            />
                            <TinyStatCompare icon={ <Bolt className="size-4"/> } label="Crit Mult"
                                             value1={ `${ fmt(weapon1.criticalMultiplier, 2) }×` }
                                             value2={ `${ fmt(weapon2.criticalMultiplier, 2) }×` }
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">

                            <Badge className="rounded-full text-red-400"
                                   variant="outline">x{ fmt(weapon1.multiplier, 2) } mult</Badge>

                            <Badge className="rounded-full text-blue-400"
                                   variant="outline">x{ fmt(weapon1.multiplier, 2) } mult</Badge>


                        </div>
                        <div className="flex items-center gap-2">
                            { actionsSlot }
                            { onSelect && (
                                <Button size="sm" onClick={ () => onSelect(weapon1) }
                                        variant={ selected ? "default" : "secondary" }>
                                    { selected ? "Selected" : "Select" }
                                </Button>
                            ) }

                            { onSwap && (
                                <Button size="sm" onClick={ onSwap }>
                                    Swap
                                </Button>
                            ) }
                        </div>
                    </CardFooter>
                </Card>
            </motion.div>
        </TooltipProvider>
    );
}

function StatTile({ icon, label, value, hint }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    hint?: string
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center justify-between rounded-2xl border p-3">
                    <div className="flex items-center gap-2">
                        { icon }
                        <span className="text-sm text-muted-foreground">{ label }</span>
                    </div>
                    <span className="font-semibold tabular-nums">{ value }</span>
                </div>
            </TooltipTrigger>

            { hint ? <TooltipContent className="max-w-xs text-xs">{ hint }</TooltipContent> : null }

        </Tooltip>
    );
}

function StatTileCompare(
    { icon, label, value1, value2, hint }:
    { icon: React.ReactNode; label: string; value1: string; value2: string; hint?: string }
) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className="flex items-center justify-between rounded-2xl border p-3">
                    <div className="flex items-center gap-2">
                        { icon }
                        <span className="text-sm text-muted-foreground">{ label }</span>
                    </div>
                    <span className="font-semibold tabular-nums text-red-400">{ value1 }</span>
                    <span className="font-semibold tabular-nums text-blue-400">{ value2 }</span>
                    <span className={ `font-medium tabular-nums  ${ value1 > value2
                        ? 'text-green-400'
                        : 'text-red-600'
                    }` }>
                        { value1 > value2
                            ? <ArrowUpIcon/>
                            : <ArrowDownIcon/>
                        }
                    </span>
                </div>
            </TooltipTrigger>

            { hint ? <TooltipContent className="max-w-xs text-xs">{ hint }</TooltipContent> : null }

        </Tooltip>
    );
}

function TinyStat(
    { icon, label, value }:
    { icon: React.ReactNode; label: string; value: string }
) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                { icon }
                { label }
            </div>
            <div className="font-medium tabular-nums">{ value }</div>
        </div>
    );
}

function TinyStatCompare(
    { icon, label, value1, value2 }:
    { icon: React.ReactNode; label: string; value1: string; value2: string }
) {

    return (
        <div className="flex items-center justify-between rounded-xl bg-muted/30 p-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                { icon }
                { label }
            </div>
            <div className="font-medium tabular-nums text-red-400">{ value1 }</div>
            <div className="font-medium tabular-nums text-blue-400 ">{ value2 }</div>
            <div className={ `font-medium tabular-nums  ${ value1 > value2
                ? 'text-green-400'
                : 'text-red-600'

            }` }>
                { value1 > value2
                    ? <ArrowUpIcon/>
                    : <ArrowDownIcon/>
                }
            </div>
        </div>
    );
}

