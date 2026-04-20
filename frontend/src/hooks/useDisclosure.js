import { useState, useCallback } from 'react';

/**
 * useDisclosure — manages open/closed boolean state.
 *
 * Usage:
 *   const { isOpen, open, close, toggle } = useDisclosure();
 *
 * @param {boolean} [defaultOpen=false]
 */
export default function useDisclosure(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const open   = useCallback(() => setIsOpen(true), []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}
