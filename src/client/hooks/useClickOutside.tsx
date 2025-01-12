// hooks/useClickOutside.tsx

import { useEffect } from 'react';

type AnyEvent = MouseEvent | TouchEvent;

export const useClickOutside = <T extends HTMLElement | null>(
    ref: React.RefObject<T>,
    handler: (event: AnyEvent) => void
) => {
    useEffect(() => {
        const listener = (event: AnyEvent) => {
            // Do nothing if clicking ref's element or its descendants
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};
