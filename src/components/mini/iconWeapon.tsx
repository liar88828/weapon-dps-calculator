import type { ReactNode } from "react";

export function IconWeapon({
  text,
  icon,
}: {
  text: string | number;
  icon: ReactNode;
}) {
  return (
    <div className=" border rounded-lg flex items-center flex-col gap-2 sm:px-4 px-3 py-3  ">
      <p className="text-muted-foreground">{icon}</p>
      <span className={"text-nowrap"}>{text}</span>
    </div>
  );
}
