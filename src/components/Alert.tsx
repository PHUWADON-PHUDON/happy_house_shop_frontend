import { useEffect } from "react";

interface PropType {
    isalert:boolean;
    setisalert:(value:boolean) => void;
    textalert:string;
}

export default function Alert({isalert,setisalert,textalert}:PropType) {

    useEffect(() => {
        let time:any;

        if (isalert) {
            time = setTimeout(() => {
                setisalert(false);
            },5000);
        }

        return () => clearTimeout(time);
    },[isalert]);

    return(
        <div className={`alert ${isalert ? "alertaction":""} h-[80px] rounded-[8px] overflow-hidden flex w-[400px] shadow-[0_0_10px_#b5b5b5] bg-white absolute left-[50%] translate-x-[-50%] translate-y-[-200px] z-10`}>
            <div className="w-[10px] bg-[#ffc021] h-full"></div>
            <div className="flex items-center gap-[10px] p-[0_10px]">
                <div className="w-[35px] h-[35px] bg-[#ffc021] rounded-[100%] flex justify-center items-center shrink-0">
                    <i className="fa-solid fa-exclamation text-[25px] font-bold text-white"></i>
                </div>
                <p className="text-[14px]">{textalert}</p>
            </div>
            <span className={`${isalert ? "alertloadbar":""} absolute bottom-0 left-0 w-full h-[4px] bg-[#ffc021]`}></span>
        </div>
    );
}