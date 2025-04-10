import { useState,useEffect } from "react";

export default function Home() {
    const [barcode, setbarcode] = useState<string>("");

    //!scan

    useEffect(() => {
        const handleBarcode = (event:any) => {
            if (/[0-9]/.test(event.key)) {
                setbarcode((prev) => prev + event.key);
            }
            else if (event.key === "Enter") {
                setbarcode("");
                console.log(barcode);
            }
        }

        window.addEventListener("keydown",handleBarcode);

        return () => {
            window.removeEventListener("keydown",handleBarcode)
        };
    },[barcode]);

    //!

    return(
        <div>home</div>
    );
}