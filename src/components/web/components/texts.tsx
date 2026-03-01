import type { ReactNode } from "react";

export function CalculateText({
  title,
  cal,
  result,
}: Readonly<{
  title: string;
  cal: ReactNode;
  result: ReactNode;
}>) {
  return (
    <div>
      <span className="font-medium">{title}:</span>
      <ul className={"list-disc list-inside"}>
        <li>{cal}</li>
        <li>{result}</li>
      </ul>
    </div>
  );
}
