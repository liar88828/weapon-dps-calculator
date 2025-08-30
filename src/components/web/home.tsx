import { IconWeapon } from "@/components/mini/iconWeapon.tsx";
import { MyInput } from "@/components/mini/myInput.tsx";
import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { TooltipProvider } from "@/components/ui/tooltip";
import { trueDPS, useDpsWeapon } from "@/hook/useDpsWeapon.ts";
import { useTitle } from "@/hook/useTitle.ts";
import { useFormWeaponStore, type Weapon } from "@/store/useFormWeaponStore.ts";
import { useSettingStore } from "@/store/useSettingStore.ts";
import { useWeaponFilterStore } from "@/store/useWeaponFilterStore.ts";
import { useWeaponListStore } from "@/store/useWeaponListStore.ts";
import { motion } from "framer-motion";
import {
    Biohazard,
    Bolt,
    Box,
    Clock,
    Layers2,
    Pickaxe,
    Plus,
    RefreshCcw,
    RefreshCw,
    RotateCcw,
    Scroll,
    Sparkle,
    Sword,
    Swords,
    TrashIcon
} from "lucide-react";
import { useState } from "react"

export default function Home() {
    useTitle('Home')

    const { setField, reset, setForm, form } = useFormWeaponStore();
    const { form: setting, setField: setSetting } = useSettingStore();
    const { weapons, removeWeapon, addWeapon } = useWeaponListStore();
    const {
        // Normal Damage
        rps,
        dMag,
        totalCycleTime,
        normalDpsEffective,
        normalDps,

        // With Critical
        criticalAverage,
        criticalDps,
        criticalTotalDamagePerMag,
        criticalDpsEffective,
        // Normal + Elemental
        normalPlusElementDps,
        normalPlusElementTotalDamagePerMag,
        normalPlusElementDpsEffective,

        // Critical + Elemental
        criticalPlusElementDps,
        criticalPlusElementTotalDamagePerMag,
        criticalPlusElementDpsEffective,
    } = useDpsWeapon(form)

    function saveWeapon() {
        addWeapon(form)
        removeWeapon(form.id)
        reset()
    }

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
                        <div className="space-x-2">

                            <ListSavedWeaponDialog weapons={ weapons }
                                                   selectWeapon={ setForm }
                                               removeWeapon={ removeWeapon }/>

                            <Button
                                variant={ setting.rps ? 'default' : 'destructive' }
                                onClick={ () => setSetting("rps", !setting.rps) }
                            >
                                { setting.rps ? 'Enable RPS' : 'Disable RPS' }
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Weapon Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <MyInput
                                icon={<Scroll />}
                                title="Name" type="text" value={ form.name } onChange={ v => setField("name", v) }
                                     placeholder="Name: Bazooka"/>

                            <MyInput
                                icon={<Layers2 />}
                                title="Category" type="text" value={ form.category }
                                     onChange={ v => setField("category", v) }
                                     placeholder="Category: Rocket"/>

                            <MyInput
                                icon={<Sword/>}
                                title="Damage" type="number" value={ form.damage }
                                     onChange={ v => setField("damage", v) }
                                     placeholder="Damage: 25"/>
                            <MyInput
                                icon={<Swords />}
                                title="Multiplier" type="number" value={ form.multiplier }
                                     onChange={ v => setField("multiplier", v) } placeholder="Multiplier: 2"/>

                            <MyInput icon={ <Clock/> } title="Rate of Fire (RPM)" type="number" value={ form.fireTime }
                                     onChange={ v => setField("fireTime", v) } placeholder="RPM: 600"/>
                            <MyInput icon={ <Box/> } title="Magazine Size" type="number" value={ form.magazine }
                                     onChange={ v => setField("magazine", v) } placeholder="Magazine Size: 30"/>
                            <MyInput icon={ <RefreshCcw/> } title="Reload Time (s)" type="number"
                                     value={ form.reloadTime }
                                     onChange={ v => setField("reloadTime", v) } placeholder="Reload Time: 2.5"/>


                            <MyInput icon={ <Biohazard/> } title="Elemental DPS" type="number"
                                     value={ form.elementalDps }
                                     onChange={ v => setField("elementalDps", v) } placeholder="Elemental DPS: 50"/>
                            <MyInput icon={ <Bolt/> } title="Critical Chance (%)" type="number"
                                     value={ form.criticalChange }
                                     onChange={ v => setField("criticalChange", v) } placeholder="Critical Chance: 30"/>
                            <MyInput icon={ <Sparkle/> } title="Critical Multiplier" type="number"
                                     value={ form.criticalMultiplier }
                                     onChange={ v => setField("criticalMultiplier", v) } placeholder="Multiplier: 2"/>

                        </CardContent>
                        <CardFooter className="gap-2">
                            <Button onClick={ saveWeapon }> <Plus /> Add</Button>
                            <Button variant="destructive" onClick={ reset }> <RotateCcw /> Reset</Button>
                        </CardFooter>
                    </Card>

                    <Card className={ 'text-sm sm:text-base' }>
                        <CardHeader>
                            <CardTitle>Results</CardTitle>
                            <div>


                                <p className={ !setting.rps ? 'line-through' : '' }>RPS = { form.fireTime } / 60
                                    = <b>{ rps }</b> bullets/sec</p>





                                <p>
                                    Cycle Time = { form.magazine } / { rps } + { form.reloadTime } ={ " " }
                                    { totalCycleTime }s
                                </p>

                                <p>DMag = ({ form.damage } × { form.multiplier }) × { form.magazine } = { dMag } </p>


                                {/*<p>*/ }
                                {/*    DPS (no reload&mag) = ({ form.damage } × { form.multiplier })*/ }
                                {/*    × { rps } ={ " " }*/ }
                                {/*    <b>{ normalDps }</b>*/ }
                                {/*</p>*/ }

                                {/*<p>*/ }
                                {/*    DPS (no ammo) = ({ damage } × { multiplier }) × { rps } ={ " " }*/ }
                                {/*    <b>{ normalDps }</b>*/ }
                                {/*</p>*/ }
                            </div>
                        </CardHeader>

                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                            {/* Normal Damage */ }
                            <div>
                                <h3 className="font-semibold">Normal Damage</h3>
                                <p>
                                    Damage (Base) = ({ form.damage } × { form.multiplier }) = <b>{ normalDps }</b>
                                </p>
                                <p>Total Damage per Mag
                                    = { normalDps } × { form.magazine } = { (normalDps * form.magazine) }</p>

                                <p>Effective DPS
                                    = { (normalDps * form.magazine) } / { totalCycleTime } = { normalDpsEffective }</p>
                            </div>

                            {/* With Critical */ }
                            <div>
                                <h3 className="font-semibold">With Critical</h3>
                                {/*<p>hit Damage = { criticalHit }</p>*/ }
                                <p>Average Damage = { criticalAverage } </p>
                                <p>Damage (Critical) = <b>{ criticalDps }</b></p>
                                <p>Total Damage per Mag = { criticalTotalDamagePerMag }</p>
                                <p>Effective DPS = { criticalDpsEffective }</p>
                            </div>

                            {/* Normal + Elemental */ }
                            <div>
                                <h3 className="font-semibold">Normal + Elemental</h3>
                                <p>
                                    Base Damage + Elemental = { normalDps } + { form.elementalDps } ={ " " }
                                    <b>{ normalPlusElementDps }</b>
                                </p>
                                <p>
                                    Total Damage per Mag = { normalPlusElementTotalDamagePerMag }
                                </p>
                                <p>
                                    Effective DPS = { normalPlusElementDpsEffective }
                                </p>
                            </div>

                            {/* Critical + Elemental */ }
                            <div>
                                <h3 className="font-semibold">Critical + Elemental</h3>
                                <p>
                                    Crit Damage + Elemental = { criticalDps } + { form.elementalDps } ={ " " }
                                    <b>{ criticalPlusElementDps }</b>
                                </p>
                                <p>
                                    Total Damage per Mag = { criticalPlusElementTotalDamagePerMag }
                                </p>
                                <p>
                                    Effective DPS = { criticalPlusElementDpsEffective }
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}

export function ListSavedWeaponDialog({ weapons, selectWeapon, removeWeapon, }: {
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

            <DialogContent className="sm:max-w-5xl w-full px-3 sm:px-6">
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
                    <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
                            { filteredWeapons.map((w) => {
                                // const dps = w.fireTime > 0 ? (w.damage * w.multiplier) / w.fireTime : 0;
                                return (
                                    <WeaponList w={ w } key={ w.id }
                                                removeWeapon={ removeWeapon }
                                                selectWeapon={ selectWeapon }/>
                                );
                            }) }
                    </div>

                ) : (
                    <p className="text-muted-foreground">No saved weapons.</p>
                ) }
                </div>

            </DialogContent>
        </Dialog>

    );
}

export function WeaponList({ w, removeWeapon, selectWeapon, isWeapon1 }: {
    w: Weapon,
    isWeapon1?: boolean,
    selectWeapon: (w: Weapon) => void,
    removeWeapon: (w: Weapon['id']) => void
}) {
    const setting = useSettingStore(state => state.form);

    return (
        <Card className={ 'gap-0 ' }>
            <CardHeader className={ 'px-3 sm:px-6' }>
                <CardTitle
                    className={ 'capitalize' }>{ w.name } ({ w.category }) {
                    trueDPS(w, setting.rps)
                }

                </CardTitle>
            </CardHeader>
            <CardContent className={ 'px-3 sm:px-6' }>
                <div className="flex flex-row gap-2 sm:text-sm text-xs  ">
                    <IconWeapon icon={ <Sword/> } text={ `${ w.damage } x ${ w.multiplier }` }/>
                    <IconWeapon icon={ <Clock/> } text={ `${ w.fireTime } ft` }/>
                    <IconWeapon icon={ <Box/> } text={ `${ w.magazine } mag` }/>
                    <IconWeapon icon={ <RefreshCw/> } text={ `${ w.reloadTime } rel` }/>

                    {/*<p>*/ }
                    {/*    { w.damage } x { w.multiplier } dmg - ({ dps } DPS)*/ }
                    {/*</p>*/ }

                    <div className="flex flex-col justify-between">
                        <DialogClose asChild>
                            <Button
                                size="sm" onClick={ () => selectWeapon(w) }>
                                <Pickaxe/>
                                {
                                    isWeapon1 === undefined ? null : <>
                                        { isWeapon1 ? '1' : '2' }
                                    </>
                                }
                                {/*<span className={ 'hidden sm:block' }>Select</span>*/ }

                            </Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={ () => removeWeapon(w.id) }
                        >
                            <TrashIcon/>
                            {/*<span className={ 'hidden sm:block' }>Delete</span>*/ }
                        </Button>
                    </div>

                </div>
            </CardContent>
        </Card>
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
                            <p>RPS = { fireTime } / 60 = <b>{ rps }</b> bullets/sec</p>
                            <p>DPS (no reload) = { damage } × { rps } = <b>{ dps }</b></p>
                            <p>Cycle Time
                                = { magazineRate } + { reloadTime } = <b>{ totalWithSiklus }s</b>
                            </p>
                            <p>Total Damage per Mag = { totalDamagePerMagazine }</p>
                            <p>Effective DPS = { totalDpsEffective }</p>
                        </div>

                        <div>
                            <h3 className="font-semibold">With Critical</h3>
                            <p>Average Damage = <b>{ criticalAverage }</b></p>
                            <p>Damage (Critical) = { criticalDps }</p>
                            <p>Total Damage per Mag = { criticalTotalDamagePerMagazine }</p>
                            <p>Effective DPS = { criticalTotalDpsEffective }</p>
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
