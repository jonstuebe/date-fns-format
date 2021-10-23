import { ReactNode } from "react";

export default function Category({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-6">
      <h3 className="mb-4 text-2xl font-bold dark:text-white">{label}</h3>
      <div className="flex flex-wrap items-center justify-around max-w-4xl gap-2 sm:w-full">
        {children}
      </div>
    </div>
  );
}
