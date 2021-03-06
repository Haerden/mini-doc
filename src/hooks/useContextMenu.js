import { useEffect, useRef } from "react";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

const useContextMenu = (itemArr, targetSelector) => {
    const clickedElement = useRef(null);

    useEffect(() => {
        const menu = new Menu();
        itemArr.forEach(item => {
            menu.append(new MenuItem(item));
        });

        const handleContextMenu = (e) => {
            // only show when target contains e.target
            if (document.querySelector(targetSelector).contains(e.target)) {
                clickedElement.current = e.target

                menu.popup({
                    window: remote.getCurrentWindow()
                });
            }

        };

        window.addEventListener('contextmenu', handleContextMenu);

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
        }
    }, [itemArr, targetSelector]);

    return clickedElement;
};

export default useContextMenu;