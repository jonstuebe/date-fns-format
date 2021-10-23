import { useState, useCallback } from "react";

export function useModalState(initialVisible: boolean = false): {
  visible: boolean;
  onClose: VoidFunction;
  onOpen: VoidFunction;
  onToggle: VoidFunction;
} {
  const [visible, setVisible] = useState(() => initialVisible);

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const onOpen = useCallback(() => {
    setVisible(true);
  }, []);

  const onToggle = useCallback(() => {
    setVisible((visible) => !visible);
  }, []);

  return {
    visible,
    onClose,
    onOpen,
    onToggle,
  };
}
