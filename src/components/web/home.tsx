import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { TooltipProvider } from "@/components/ui/tooltip";
import { useTitle } from "@/hook/useTitle.ts";
import {
    calcBaseDps,
    calcCritDps,
    getEffectiveDps,
    getMagazineTime,
    getRoundsPerSecond
} from "@/lib/calculate-weapon.ts";
import { useFormWeaponStore, type Weapon } from "@/store/useFormWeaponStore.ts";
import { useWeaponFilterStore } from "@/store/useWeaponFilterStore.ts";
import { useWeaponListStore } from "@/store/useWeaponListStore.ts";
import { motion } from "framer-motion";
import { useState } from "react"

export default function Home() {
    useTitle('Home')

    const { setField, reset, setForm, form } = useFormWeaponStore();
    const { weapons, removeWeapon, addWeapon } = useWeaponListStore();
    const {
        id,
        name,
        category,
        damage,
        fireTime,
        magazine,
        reloadTime,
        criticalChange,
        criticalMultiplier,
        multiplier,
        elementalDps,
    } = form

    function saveWeapon() {
        addWeapon({
            name,
            category,
            damage,
            fireTime,
            magazine,
            reloadTime,
            criticalChange,
            criticalMultiplier,
            multiplier,
            elementalDps,
        })
        removeWeapon(id)
        reset()
    }

    // Convert to numbers
    const numDamage = Number(damage);
    const numMultiplier = Number(multiplier);
    const numFireTime = Number(fireTime);
    const numMagazine = Number(magazine);
    const numReloadTime = Number(reloadTime);
    const numElementalDps = Number(elementalDps);

    // Shots per second
    const rps = getRoundsPerSecond(numFireTime);

    // Cycle time
    const magazineTime = getMagazineTime(numMagazine, rps);
    const totalCycleTime = magazineTime + numReloadTime;

    // 1️⃣ Normal DPS
    const damageMultiplier = numDamage * numMultiplier;
    const normalDps = damageMultiplier * rps;

    // 2️⃣ Critical DPS
    const criticalAverage = calcCritDps(form);
    const criticalHit = calcBaseDps(form);
    const criticalDps = criticalAverage * rps;

    // 3️⃣ Normal + Elemental DPS
    const normalPlusElementDps = normalDps + numElementalDps;

    // 4️⃣ Critical + Elemental DPS
    const criticalPlusElementDps = criticalDps + numElementalDps;

    // Effective DPS
    const normalDpsEffective = getEffectiveDps(normalDps, numMagazine, totalCycleTime);
    const criticalDpsEffective = getEffectiveDps(criticalDps, numMagazine, totalCycleTime);
    const normalPlusElementDpsEffective = getEffectiveDps(normalPlusElementDps, numMagazine, totalCycleTime);
    const criticalPlusElementDpsEffective = getEffectiveDps(criticalPlusElementDps, numMagazine, totalCycleTime);

    return (
        <TooltipProvider>
            <motion.div
                initial={ { opacity: 0, y: 8 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.18 } }
                className="h-full"
            >
                <div className=" space-y-8">
                    <div className="flex justify-between">

                        <h1 className="text-3xl font-bold">Weapon DPS Calculator</h1>
                        <ListSavedWeaponDialog weapons={ weapons } selectWeapon={ setForm }
                                               removeWeapon={ removeWeapon }/>

                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Weapon Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <MyInput title="Name" type="text" value={ name } onChange={ v => setField("name", v) }
                                     placeholder="Name: Bazooka"/>

                            <MyInput title="Category" type="text" value={ category }
                                     onChange={ v => setField("category", v) }
                                     placeholder="Category: Rocket"/>

                            <MyInput title="Damage" type="number" value={ damage }
                                     onChange={ v => setField("damage", v) }
                                     placeholder="Damage: 25"/>
                            <MyInput title="Multiplier" type="number" value={ multiplier }
                                     onChange={ v => setField("multiplier", v) } placeholder="Multiplier: 2"/>

                            <MyInput title="Rate of Fire (RPM)" type="number" value={ fireTime }
                                     onChange={ v => setField("fireTime", v) } placeholder="RPM: 600"/>
                            <MyInput title="Magazine Size" type="number" value={ magazine }
                                     onChange={ v => setField("magazine", v) } placeholder="Magazine Size: 30"/>
                            <MyInput title="Reload Time (s)" type="number" value={ reloadTime }
                                     onChange={ v => setField("reloadTime", v) } placeholder="Reload Time: 2.5"/>


                            <MyInput title="Elemental DPS" type="number" value={ elementalDps }
                                     onChange={ v => setField("elementalDps", v) } placeholder="Elemental DPS: 50"/>
                            <MyInput title="Critical Chance (%)" type="number" value={ criticalChange }
                                     onChange={ v => setField("criticalChange", v) } placeholder="Critical Chance: 30"/>
                            <MyInput title="Critical Multiplier" type="number" value={ criticalMultiplier }
                                     onChange={ v => setField("criticalMultiplier", v) } placeholder="Multiplier: 2"/>

                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button onClick={ saveWeapon }>Add</Button>
                            <Button variant="destructive" onClick={ reset }>Reset</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Normal Damage */ }
                            <div>
                                <h3 className="font-semibold">Normal Damage</h3>
                                <p>RPS = { fireTime } / 60 = <b>{ rps.toFixed(2) }</b> bullets/sec</p>
                                <p>
                                    Cycle Time = { magazineTime.toFixed(2) } + { reloadTime } ={ " " }
                                    { totalCycleTime.toFixed(2) }s
                                </p>
                                <p>
                                    DPS (no reload) = { damage } × { multiplier } × { rps.toFixed(2) } ={ " " }
                                    <b>{ normalDps.toFixed(2) }</b>
                                </p>

                                <p>Total Damage per Mag = { (normalDps * magazine).toFixed(2) }</p>
                                <p>Effective DPS = { normalDpsEffective.toFixed(2) }</p>
                            </div>

                            {/* With Critical */ }
                            <div>
                                <h3 className="font-semibold">With Critical</h3>
                                <p>Average Damage = { criticalAverage.toFixed(2) } </p>
                                <p>hit Damage = { criticalHit.toFixed(2) }</p>
                                <p>DPS (Critical) = <b>{ criticalDps.toFixed(2) }</b></p>
                                <p>Total Damage per Mag = { (criticalDps * magazine).toFixed(2) }</p>
                                <p>Effective DPS = { criticalDpsEffective.toFixed(2) }</p>
                            </div>

                            {/* Normal + Elemental */ }
                            <div>
                                <h3 className="font-semibold">Normal + Elemental</h3>
                                <p>
                                    Base DPS + Elemental = { normalDps.toFixed(2) } + { elementalDps } ={ " " }
                                    <b>{ normalPlusElementDps.toFixed(2) }</b>
                                </p>
                                <p>
                                    Total Damage per Mag = { (normalPlusElementDps * magazine).toFixed(2) }
                                </p>
                                <p>
                                    Effective DPS = { normalPlusElementDpsEffective.toFixed(2) }
                                </p>
                            </div>

                            {/* Critical + Elemental */ }
                            <div>
                                <h3 className="font-semibold">Critical + Elemental</h3>
                                <p>
                                    Crit DPS + Elemental = { criticalDps.toFixed(2) } + { elementalDps } ={ " " }
                                    <b>{ criticalPlusElementDps.toFixed(2) }</b>
                                </p>
                                <p>
                                    Total Damage per Mag = { (criticalPlusElementDps * magazine).toFixed(2) }
                                </p>
                                <p>
                                    Effective DPS = { criticalPlusElementDpsEffective.toFixed(2) }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}

export function ListSavedWeaponDialog(
    {
        weapons,
        selectWeapon,
        removeWeapon,
    }: {
        weapons: Weapon[];
        selectWeapon: (weapon: Weapon) => void;
        removeWeapon: (id: string) => void;
    }) {
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
        // 🔹 DPS sort first if chosen
        if (sortOrder) {
            const dpsA = a.fireTime > 0 ? (a.damage * a.multiplier) / a.fireTime : 0;
            const dpsB = b.fireTime > 0 ? (b.damage * b.multiplier) / b.fireTime : 0;
            return sortOrder === "asc" ? dpsA - dpsB : dpsB - dpsA;
        }

        // 🔹 Otherwise apply name sorting
        return shortNameSort === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open</Button>
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
                                                <Button size="sm" onClick={ () => selectWeapon(w) }>
                                                    Select
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

export function MyInput(
    {
        title,
        type = "text",
        error,
        value,
        onChange,
        placeholder
    }: {
        title: string;
        type: "number" | "text";
        error?: string;
        value: number | string;
        onChange: (value: string) => void;
        placeholder?: string;
    }) {
    return (
        <div className="flex flex-col gap-1">
            <Label>{ title }</Label>
            <Input
                type={ type }
                onChange={ (e) => onChange(e.target.value) }
                value={ value }
                placeholder={ placeholder }
                className="w-full"
            />
            { error && <p className="text-red-500 text-xs">Error: { error }</p> }
        </div>
    );
}

export function HomeOld() {
    // const loader = useLoaderData<typeof loadRootData>()

    // description
    const [ name, setName ] = useState('')
    const [ category, setCategory ] = useState('')

    // status
    const [ damage, setDamage ] = useState(0)
    const [ magazine, setMagazine ] = useState(0)
    const [ fireTime, setFireTime ] = useState(0)
    const [ criticalChange, setCriticalChange ] = useState(0)
    const [ criticalMultiplier, setCriticalMultiplier ] = useState(1)
    const [ reloadTime, setReloadTime ] = useState(0)

    // Normal Damage
    const rps = fireTime / 60
    const dps = damage * rps

    const magazineRate = magazine / rps || 0
    const totalWithSiklus = magazineRate + reloadTime
    const totalDamagePerMagazine = dps * magazine
    const totalDpsEffective = totalDamagePerMagazine / totalWithSiklus || 0

    const criticalAverage =
        (damage * (100 - criticalChange) / 100) +
        (damage * criticalMultiplier * (criticalChange / 100))
    const criticalDps = criticalAverage * rps
    const criticalTotalDamagePerMagazine = criticalDps * magazine
    const criticalTotalDpsEffective = criticalTotalDamagePerMagazine / totalWithSiklus || 0

    const resetAll = () => {
        setDamage(0);
        setMagazine(0);
        setFireTime(0);
        setCriticalChange(0);
        setCriticalMultiplier(2);
        setReloadTime(0);
    };

    return (
        <div>
            <div className="p-6 space-y-8">
                <h1 className="text-3xl font-bold">Weapon DPS Calculator</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Weapon Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <MyInput title="Name" type="text" value={ name } onChange={ v => setName(v) }
                                 placeholder="Name: Bazzoka"/>

                        <MyInput title="Category" type="text" value={ category } onChange={ v => setCategory(v) }
                                 placeholder="Category: Rocket"/>

                        <MyInput title="Damage" type="number" value={ damage } onChange={ v => setDamage(Number(v)) }
                                 placeholder="Damage: 25"/>
                        <MyInput title="Damage" type="number" value={ damage } onChange={ v => setDamage(Number(v)) }
                                 placeholder="Damage: 25"/>
                        <MyInput title="Rate of Fire (RPM)" type="number" value={ fireTime }
                                 onChange={ v => setFireTime(Number(v)) } placeholder="RPM: 600"/>
                        <MyInput title="Critical Chance (%)" type="number" value={ criticalChange }
                                 onChange={ v => setCriticalChange(Number(v)) } placeholder="Critical Chance: 30"/>
                        <MyInput title="Critical Multiplier" type="number" value={ criticalMultiplier }
                                 onChange={ v => setCriticalMultiplier(Number(v)) } placeholder="Multiplier: 2"/>
                        <MyInput title="Magazine Size" type="number" value={ magazine }
                                 onChange={ v => setMagazine(Number(v)) } placeholder="Magazine Size: 30"/>
                        <MyInput title="Reload Time (s)" type="number" value={ reloadTime }
                                 onChange={ v => setReloadTime(Number(v)) } placeholder="Reload Time: 2.5"/>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={ resetAll }>Add</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Results</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="font-semibold">Normal Damage</h3>
                            <p>RPS = { fireTime } / 60 = <b>{ rps.toFixed(2) }</b> bullets/sec</p>
                            <p>DPS (no reload) = { damage } × { rps.toFixed(2) } = <b>{ dps.toFixed(2) }</b></p>
                            <p>Cycle Time
                                = { magazineRate.toFixed(2) } + { reloadTime } = <b>{ totalWithSiklus.toFixed(2) }s</b>
                            </p>
                            <p>Total Damage per Mag = { totalDamagePerMagazine.toFixed(2) }</p>
                            <p>Effective DPS = { totalDpsEffective.toFixed(2) }</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">With Critical</h3>
                            <p>Average Damage = <b>{ criticalAverage.toFixed(2) }</b></p>
                            <p>DPS (Critical) = { criticalDps.toFixed(2) }</p>
                            <p>Total Damage per Mag = { criticalTotalDamagePerMagazine.toFixed(2) }</p>
                            <p>Effective DPS = { criticalTotalDpsEffective.toFixed(2) }</p>
                        </div>
                    </CardContent>

                </Card>
                <div className="flex justify-end">
                    <Button variant="destructive" onClick={ resetAll }>Reset</Button>
                </div>
            </div>

            <h1>Calculate:</h1>

            <h2>Normal Damage:</h2>
            <p>RPS = { fireTime } / 60 = { rps } peluru/detik</p>
            <p>DPS non reload = { damage } x { rps } = { dps } DPS</p>

            <h3>Normal Damage with Magazine:</h3>
            <p>Waktu habis mag = { magazine } / { rps } = { magazineRate } detik</p>
            <p>Total waktu siklus = { dps } x { magazineRate }= { totalWithSiklus } detik</p>
            <p>Total damage per mag = { dps } x { magazine }= { totalDamagePerMagazine } </p>
            <p>DPS efektif = { totalDamagePerMagazine } / { totalWithSiklus } ≈ { totalDpsEffective } DPS</p>


            <h2>With Critical Damage:</h2>
            <p className={ 'text-nowrap' }>Damage Critical = ({ damage } x { (100 - criticalChange) / 100 }) +
                ({ damage } x { criticalMultiplier } x { (criticalChange / 100) })
                = { criticalAverage }
            </p>
            <p>DPS Critical = { criticalAverage } x { rps } = { criticalDps } DPS</p>

            <h3>Normal Damage with Magazine:</h3>
            <p>Total damage per mag = { criticalDps } x { magazine }= { criticalTotalDamagePerMagazine } </p>
            <p>Total DPS efektif
                = { criticalTotalDamagePerMagazine } / { totalWithSiklus } ≈ { criticalTotalDpsEffective } DPS</p>

        </div>
    )
}
