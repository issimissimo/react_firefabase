import { useCallback, useRef } from 'react';

/**
 * @typedef {Object} eventHandlers
 * @property {Function} handleClick
 * @property {Function} handleDoubleClick
 */

/**
 * Hook to handle click and double-click events.
 * In React, a double-click will FIRST trigger 2 click events before a double-click event.
 * This hook delays the click events long enough to detect whether a double-click will occur.
 * If a double-click occurs, then the click event(s) are cancelled.
 *
 * @param {Object} handlers
 * @param {Function} handlers.onClick
 * @param {Function} handlers.onDoubleClick
 * @return {eventHandlers}
 */
function useSingleAndDoubleClicks({ onClick, onDoubleClick }) {
  const timer = useRef;

  const cancelPendingClick = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  }, [timer]);

  /**
   * This handler must delay long enough to be sure a second click will not trigger a double-click.
   * According to Microsoft, in Windows the max delay between clicks for a double-click is 500ms.
   * Other operating systems can have other delays, and most have customizable settings.
   */
  const handleClick = useCallback((data) => {
    // We only cache the most recent click event, so cancel any pending clicks
    cancelPendingClick();
    timer.current = setTimeout(() => {
      timer.current = null;
      onClick(data);
    }, 300)
  }, [timer, cancelPendingClick, onClick]);

  const handleDoubleClick = useCallback((data) => {
    cancelPendingClick();
    onDoubleClick(data);
  }, [cancelPendingClick, onDoubleClick]);

  return { handleClick, handleDoubleClick };
}

export default useSingleAndDoubleClicks;