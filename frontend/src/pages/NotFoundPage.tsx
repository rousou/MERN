import { useState } from "react";
import { Form } from "react-bootstrap";
import { IoColorPaletteSharp } from "react-icons/io5";
import { MdFormatColorFill } from "react-icons/md";
import styles from "../styles/testing.module.css";

const defaultColor = "#fafafa";
const defaultLines: number = 10;

const NotFoundPage = () => {

    const [sz, setSz] = useState(defaultLines);
    const [colorChange, setColorChangeTo] = useState(defaultColor);
    const [count, setCount] = useState(0);
    const [txt, setTxt] = useState("\n");

    function setColors(colorNumner: number){
        let caffeine = "";
        const col: {[id:number]:string}= {
            0: "cyan",
            1: "salmon",
            2: "yellowgreen",
            3: "orchid",
        };
        caffeine = col[colorNumner] ?? defaultColor;
        return caffeine;
    }

    // function setColors(colorNumner: number) {
    //     switch (colorNumner) {
    //         case 0: return "cyan";
    //         case 1: return "salmon";
    //         case 2: return "yellowgreen";
    //         case 3: return "orchid";
    //         default: return defaultColor;
    //     }
    // }

    async function changeColorNow(count: number, upDown:boolean) {
        try {
            if(upDown)
                await setCount((count) => count + 1);
            else
                await setCount((count) => count - 1);
            if (count < 0) {
                await setCount(3);
            }
            else if (count > 3) {
                await setCount(0);
            }
        } catch (error) {
            console.error(error);
        }
        setColorChangeTo(setColors(count));
    }

    async function setEmptyLines() {
        try {
            if (sz >= 20) {
                setSz(0);
            }
            else if (sz > 0 && sz < 20) {
                setSz((sz) => sz + defaultLines);
            }
            else {
                setSz(0);
            }
        } catch (error) {
            console.error(error);
        }
        for (let i = 0; i < sz; i++) {
            await setTxt((txt) => txt + "Page not found\n")
        }
    }
    return (
        <Form>
            <div style={{ backgroundColor: colorChange }}>
                <p className={styles.cssFix}>
                    Page not found {txt}
                </p>
            </div>

            <MdFormatColorFill
                className={`${styles.test} ${"ms-auto"}`}
                size={70}
                color={setColors(0)}
                onClick={() => {
                    changeColorNow(count, true);
                    setEmptyLines();
                }
                }
            />
            <IoColorPaletteSharp
                className={`${styles.test} ${"ms-auto"}`}
                size={70}
                color={setColors(0)}
                onClick={() => {
                    changeColorNow(count, false);
                    setEmptyLines();
                }}
            />

        </Form>
    );
}

export default NotFoundPage;