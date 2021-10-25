import { format } from "date-fns";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ClipboardIcon,
  ClipboardCheckIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  XIcon,
} from "@heroicons/react/outline";
import { Dialog } from "@reach/dialog";

import Category from "../components/Category";
import Token from "../components/Token";

import useCopyToClipboard from "../hooks/useCopyToClipboard";
import { useModalState } from "../hooks/useModalState";

export default function Home() {
  const [tokens, setTokens] = useState<string[]>([]);
  const { copyStatus, copy } = useCopyToClipboard();
  const { visible, onOpen, onClose } = useModalState();

  const [value, setValue] = useState(() =>
    tokens.length > 0 ? format(new Date(), tokens.join("")) : ""
  );

  useEffect(() => {
    const updateValue = () => {
      if (tokens.length > 0) {
        setValue(format(new Date(), tokens.join("")));
      } else {
        setValue("");
      }
    };
    let interval = setInterval(() => {
      updateValue();
    }, 1000);

    updateValue();
    return () => {
      clearInterval(interval);
    };
  }, [tokens]);

  const addToFormat = useCallback((pattern: string) => {
    setTokens((prev) => {
      return [...prev, pattern];
    });
  }, []);

  const addEscapedCharacter = useCallback((char: string) => {
    setTokens((prev) => {
      if (prev[prev.length - 1].includes("'")) {
        return [
          ...prev.slice(0, -1),
          `${prev[prev.length - 1].slice(0, -1)}${char}'`,
        ];
      }

      return [...prev, `'${char}'`];
    });
  }, []);

  useHotkeys("backspace", (e) => {
    e.preventDefault();

    setTokens((prev) => {
      return prev.slice(0, -1);
    });
  });

  useHotkeys("*", (e) => {
    const blockedKeys = [
      "Tab",
      "Shift",
      "Control",
      "Meta",
      "Alt",
      "Enter",
      "Backspace",
      "'",
      " ",
    ];

    if (blockedKeys.includes(e.key) || e.metaKey || e.ctrlKey) {
      return;
    }

    e.preventDefault();

    addEscapedCharacter(e.key);
  });

  useHotkeys("space", (e) => {
    e.preventDefault();

    setTokens((prev) => {
      return [...prev, " "];
    });
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 dark:bg-black">
      <Head>
        <title>date-fns format</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 w-full px-20 text-center">
        <Category label="Year">
          <Token pattern="yyyy" addToFormat={addToFormat} />
          <Token pattern="yy" addToFormat={addToFormat} />
        </Category>
        <Category label="Month">
          <Token pattern="MM" addToFormat={addToFormat} />
          <Token pattern="MMM" addToFormat={addToFormat} />
          <Token pattern="MMMM" addToFormat={addToFormat} />
        </Category>
        <Category label="Day of Month">
          <Token pattern="d" addToFormat={addToFormat} />
          <Token pattern="do" addToFormat={addToFormat} />
          <Token
            pattern="dd"
            helperText="Two Digit"
            addToFormat={addToFormat}
          />
        </Category>
        <Category label="Day of Week">
          <Token pattern="EEEEE" addToFormat={addToFormat} />
          <Token pattern="EEEEEE" addToFormat={addToFormat} />
          <Token pattern="E" addToFormat={addToFormat} />
          <Token pattern="EEEE" addToFormat={addToFormat} />
        </Category>
        <Category label="AM/PM">
          <Token pattern="a" addToFormat={addToFormat} />
          <Token pattern="aaa" addToFormat={addToFormat} />
          <Token pattern="aaaa" addToFormat={addToFormat} />
        </Category>
        <Category label="Time of Day">
          <Token pattern="B" addToFormat={addToFormat} />
        </Category>
        <Category label="Hour">
          <Token pattern="h" helperText="12 hour" addToFormat={addToFormat} />
          <Token
            pattern="hh"
            helperText="12 hour/Two Digit"
            addToFormat={addToFormat}
          />
          <Token pattern="H" helperText="24 hour" addToFormat={addToFormat} />
          <Token
            pattern="HH"
            helperText="24 hour/Two Digit"
            addToFormat={addToFormat}
          />
        </Category>
        <Category label="Minute">
          <Token pattern="m" addToFormat={addToFormat} />
          <Token
            pattern="mm"
            helperText="Two Digit"
            addToFormat={addToFormat}
          />
        </Category>
        <Category label="Second">
          <Token pattern="s" addToFormat={addToFormat} updateInterval={1000} />
          <Token
            pattern="ss"
            helperText="Two Digit"
            addToFormat={addToFormat}
            updateInterval={1000}
          />
        </Category>
        <Category label="Templates">
          <Token pattern="P" addToFormat={addToFormat} />
          <Token pattern="PP" addToFormat={addToFormat} />
          <Token pattern="PPP" addToFormat={addToFormat} />
          <Token pattern="PPPP" addToFormat={addToFormat} />
          <Token pattern="p" addToFormat={addToFormat} />
          <Token pattern="pp" addToFormat={addToFormat} updateInterval={1000} />
          <Token pattern="Pp" addToFormat={addToFormat} />
          <Token
            pattern="PPpp"
            addToFormat={addToFormat}
            updateInterval={1000}
          />
        </Category>
      </main>
      <div className="h-16" />
      <footer className="fixed bottom-0 left-0 flex items-center justify-between w-full h-16 px-4 bg-white border-t-2 dark:bg-black dark:border-gray-800">
        {tokens.length > 0 ? (
          <>
            <button
              onClick={() => {
                setTokens([]);
              }}
            >
              <XIcon className="w-6 h-6 text-black dark:text-white" />
            </button>
            <div className="flex items-center justify-center gap-2 mx-4">
              <div className="flex items-center p-2 border-2 border-gray-200 rounded-md">
                <button
                  className="mr-1"
                  onClick={() => {
                    copy(tokens.join(""));
                  }}
                >
                  {copyStatus === "inactive" ? (
                    <ClipboardIcon className="w-6 h-6 text-black dark:text-white" />
                  ) : copyStatus === "copied" ? (
                    <ClipboardCheckIcon className="w-6 h-6 text-black dark:text-white" />
                  ) : (
                    <ExclamationCircleIcon className="w-6 h-6 text-black dark:text-white" />
                  )}
                </button>
                <p className="text-black dark:text-white">
                  format(new Date(), "{tokens.join("")}")
                </p>
              </div>
              <div className="flex items-center p-2 border-2 border-gray-200 rounded-md">
                <p className="flex-1 text-base text-center text-black dark:text-white">
                  preview: {value}
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div />
            <div />
          </>
        )}

        <button onClick={onOpen}>
          <QuestionMarkCircleIcon className="w-6 h-6 text-black dark:text-white" />
        </button>
      </footer>
      <Dialog isOpen={visible} onDismiss={onClose} aria-label="Help">
        <p className="mb-4 dark:text-white">
          Clicking any button will add that format token. If you want to add
          escaped text all characters are available other than a single quote.
        </p>

        <p className="mb-4 dark:text-white">
          After you've created the time string you are looking for you can use
          the clipboard button to copy your text to your clipboard. This text
          would need to be used in coordination with the format function from
          date-fns:
        </p>

        <code className="p-2 text-sm bg-gray-100 rounded-md dark:text-white dark:bg-gray-800">
          format(new Date(), "copied string goes here")
        </code>
      </Dialog>
    </div>
  );
}
