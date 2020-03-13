import { useEffect, useCallback, RefObject } from 'react';

/**
 * This hook attaches an event listener that calls the provided `cb` whenever something
 * outside the provided element `nodeRef` is clicked.
 * Useful for closing dynamic menus.
 *
 * @param nodeRef - Reference to the node to check against
 * @param cb - Function to call when clicked outside
 */
export const useClickOutside = (nodeRef: RefObject<HTMLElement>, cb: () => void) => {
  // Click handler
  const handleClickOutside = useCallback((evt: MouseEvent) => {
    const elm = evt.target;
    if (elm instanceof Node && !nodeRef?.current?.contains(elm)) {
      cb();
    }
  }, [nodeRef, cb]);

  // Register click handler
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);
};