import { useEffect, useState } from "react";
import { format } from "date-fns";
import dynamic from "next/dynamic";

const TokenContent = dynamic(() => import("./TokenContent"), {
  ssr: false,
});

export default function Token({
  pattern,
  helperText,
  addToFormat,
  updateInterval = 60_000,
}: {
  pattern: string;
  helperText?: string;
  addToFormat: (pattern: string) => void;
  updateInterval?: number;
}) {
  const [content, setContent] = useState(() => format(new Date(), pattern));

  useEffect(() => {
    let interval = setInterval(() => {
      setContent(format(new Date(), pattern));
    }, updateInterval);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <button
      className="flex flex-col items-center justify-center h-20 p-6 mt-2 text-center border-2 w-38 rounded-xl hover:text-blue-600 focus:text-blue-600 dark:bg-black dark:text-white dark:border-gray-800"
      onClick={() => {
        addToFormat(pattern);
      }}
    >
      <p className="text-l">
        <TokenContent>{content}</TokenContent>
      </p>
      {helperText ? (
        <p className="text-xs text-gray-400">{helperText}</p>
      ) : null}
    </button>
  );
}
