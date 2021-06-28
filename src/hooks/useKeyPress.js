import { useState, useEffect } from "react";

const useKeyPress = (targetKeyCode) => {
    const [keyPressed, setKeyPressed] = useState(false);

    // 按下去
    const keyDownHandler = ({ keyCode }) => {
        if (keyCode === targetKeyCode) {
            setKeyPressed(true);
        }
    };

    // 抬手
    const keyUpHandler = ({ keyCode }) => {
        if (keyCode === targetKeyCode) {
            setKeyPressed(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', keyDownHandler)
        document.addEventListener('keyup', keyUpHandler)

        return () => {
            document.removeEventListener('keydown', keyDownHandler)
            document.removeEventListener('keyup', keyUpHandler)
        };
        // eslint-disable-next-line
    }, []);

    return keyPressed;
}

export default useKeyPress;