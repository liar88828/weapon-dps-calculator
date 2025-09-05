import { MyInput } from "@/components/mini/myInput.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { useState } from "react";

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