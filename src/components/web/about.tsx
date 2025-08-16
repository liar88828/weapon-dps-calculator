import { TooltipProvider } from "@/components/ui/tooltip";
import { useTitle } from "@/hook/useTitle.ts";
import { motion } from "framer-motion";

export default function About() {
    useTitle('About')
    return (
        <TooltipProvider>
            <motion.div
                initial={ { opacity: 0, y: 8 } }
                animate={ { opacity: 1, y: 0 } }
                transition={ { duration: 0.18 } }
                className="h-full"
            >
        <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl font-bold">About Weapon DPS Calculator</h1>
            <p>
                The <strong>Weapon DPS Calculator</strong> is designed for gamers who
                want to fine-tune their loadouts and maximize efficiency. Whether
                you’re comparing assault rifles, sniper rifles, or rocket launchers,
                this tool helps you calculate both raw and effective damage output.
            </p>
            <p>
                You can save multiple weapons, compare their stats, and even factor in
                critical hits, magazine size, reload times, and more. This ensures you
                always know which weapon will perform best in any situation.
            </p>
            <p>
                Built with <span className="font-semibold">React</span>,{" "}
                <span className="font-semibold">Zustand</span> for state management,
                and a sprinkle of <span className="font-semibold">Tailwind CSS</span>{" "}
                for styling — all so you can spend less time guessing and more time
                winning.
            </p>
            <p className="text-gray-500 text-sm">
                Disclaimer: This calculator is for fun and optimization purposes. Your
                in-game results may vary depending on skill, mods, and in-game
                balancing.
            </p>
        </div>
            </motion.div>
        </TooltipProvider>
    );
}
