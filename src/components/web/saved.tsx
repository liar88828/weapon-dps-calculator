import { Button } from "@/components/ui/button.tsx";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { WeaponList } from "@/components/web/home.tsx";
import { trueDPS } from "@/hook/useDpsWeapon.ts";
import type { Weapon } from "@/store/useFormWeaponStore.ts";
import { useSettingStore } from "@/store/useSettingStore.ts";
import { useWeaponFilterStore } from "@/store/useWeaponFilterStore.ts";
import { useWeaponListStore } from "@/store/useWeaponListStore.ts";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx"

export default function Saved() {
    const { weapons, compareWeapons, removeWeapon } = useWeaponListStore();
    const { form: setting } = useSettingStore()
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

        const dps = w.fireTime > 0 ? trueDPS(w, setting.rps) : 0;
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

    function handleExportExcel(weapons: Weapon[]) {
        // Convert data rows
        const data = weapons.map(item => ({
            "DPS": trueDPS(item, setting.rps).toFixed(2),
            "Name": item.name,
            "Category": item.category,
            "Damage": item.damage,
            "Magazine": item.magazine,
            "Fire Time": item.fireTime,
            "Critical Chance": item.criticalChange,
            "Critical Multiplier": item.criticalMultiplier,
            "Reload Time": item.reloadTime,
            "Multiplier": item.multiplier,
            "Elemental DPS": item.elementalDps,
        }))

        const ws = XLSX.utils.json_to_sheet(data, { origin: "A2", skipHeader: true })

        // === Column Headers (Row 1) ===
        const headers = [
            "DPS",
            "Name",
            "Category",
            "Damage",
            "Magazine",
            "Fire Time",
            "Critical Chance",
            "Critical Multiplier",
            "Reload Time",
            "Multiplier",
            "Elemental DPS",
        ]

        headers.forEach((header, i) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: i })
            ws[cellRef] = { v: header, s: { font: { bold: true } } }
        })

        // === Column Widths ===
        ws["!cols"] = [
            { wch: 10 }, // DPS
            { wch: 25 }, // Name
            { wch: 25 }, // Category
            { wch: 10 }, // Damage
            { wch: 10 }, // Magazine
            { wch: 12 }, // Fire Time
            { wch: 18 }, // Critical Chance
            { wch: 20 }, // Critical Multiplier
            { wch: 15 }, // Reload Time
            { wch: 12 }, // Multiplier
            { wch: 15 }, // Elemental DPS
        ]

        // === Format numeric columns as numbers ===
        data.forEach((_, rowIndex) => {
            for (let col = 3; col < headers.length; col++) { // numeric columns start at index 3
                const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: col })
                const cell = ws[cellRef]
                if (cell && typeof cell.v === "number") {
                    cell.t = "n"
                }
            }
        })

        // Create workbook
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Weapons Report")

        const userLocale = navigator.language || "en-US"
        // console.log("Browser locale:", userLocale)
        const formattedDate = new Date().toLocaleDateString(userLocale, {
            day: "numeric",
            month: "2-digit",
            year: "numeric",
        })

        // Save file
        XLSX.writeFile(wb, `WeaponsReport_${ formattedDate }.xlsx`)
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

                        <h1 className="text-3xl font-bold">Saved Weapons</h1>
                        <Button onClick={ () => handleExportExcel(filteredWeapons) } className={ 'bg-green-600' }>
                            Export Excel
                        </Button>
                    </div>

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
                        <Button variant="outline" onClick={ resetFilters }>Reset</Button>
                    </div>

                    <div >
                        { weapons.length > 0 ? (
                            <div className=" grid grid-cols-1 sm:grid-cols-2 gap-2">
                                { filteredWeapons.map((w) => {
                                    return (
                                        <WeaponList
                                            isDialog={ false }
                                            key={ w.id }
                                            w={ w }
                                            isWeapon1={ false }
                                            removeWeapon={ removeWeapon }
                                            selectWeapon={ () => {
                                            } }
                                        />
                                    );
                                }) }
                            </div>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle>No saved weapons.</CardTitle>
                                    <CardDescription>
                                        <Button variant="outline" asChild><Link to={ '/' }> Add
                                            Weapon</Link></Button>
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ) }
                    </div>
                </div>
            </motion.div>
        </TooltipProvider>
    )
}

