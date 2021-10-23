import { useCallback, useEffect, useState } from "react";

export default function useCopyToClipboard(notifyTimeout = 2500) {
  const [copyStatus, setCopyStatus] = useState<
    "inactive" | "copied" | "failed"
  >("inactive");
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(
      () => setCopyStatus("copied"),
      () => setCopyStatus("failed")
    );
  }, []);

  useEffect(() => {
    if (copyStatus === "inactive") {
      return;
    }

    const timeoutId = setTimeout(
      () => setCopyStatus("inactive"),
      notifyTimeout
    );

    return () => clearTimeout(timeoutId);
  }, [copyStatus]);

  return {
    copyStatus,
    copy,
  };
}
