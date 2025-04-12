import { useEffect } from "react";

interface PropType {
    isalert:boolean;
    setisalert:(value:boolean) => void;
    textalert:string;
    labelalert:string;
    typealert:string;
    setisconfirmalert:(value:string) => void;
}

export default function Alert({isalert,setisalert,textalert,labelalert,typealert,setisconfirmalert}:PropType) {

    //!close alert box

    useEffect(() => {
        if (typealert !== "confirm") {
            let time:any;

            if (isalert) {
                time = setTimeout(() => {
                    setisalert(false);
                },5000);
            }

            return () => clearTimeout(time);
        }
    },[isalert]);

    //!

    //!close alert confirm

    const closeConfirm = () => {
        setisalert(false);
        setisconfirmalert("cancel");
    }

    //!

    return(
        <div className={`alert ${isalert ? "alertaction":""} h-[80px] rounded-[8px] overflow-hidden flex w-[400px] shadow-[0_0_10px_#b5b5b5] bg-white absolute left-[50%] translate-x-[-50%] translate-y-[-200px] z-10`}>
            {typealert !== "confirm" ?
                <>
                <div className={`${labelalert === "s" ? "bg-[#4ad369]":labelalert === "w" ? "bg-[#ffc021]":"bg-[#fd355a]"} w-[10px] h-full`}></div>
                <div className="flex items-center gap-[10px] p-[0_10px]">
                    <div className={`${labelalert === "s" ? "bg-[#4ad369]":labelalert === "w" ? "bg-[#ffc021]":"bg-[#fd355a]"} w-[35px] h-[35px] rounded-[100%] flex justify-center items-center shrink-0`}>
                        {labelalert === "s" ? 
                            <i className="fa-solid fa-check text-[25px] font-bold text-white"></i>
                            :
                            labelalert === "w" ? 
                                <i className="fa-solid fa-exclamation text-[25px] font-bold text-white"></i>
                                :
                                <i className="fa-solid fa-x text-[25px] font-bold text-white"></i>
                        }
                    </div>
                    <p className="text-[14px]">{textalert}</p>
                </div>
                <span className={`${isalert ? "alertloadbar":""} ${labelalert === "s" ? "bg-[#4ad369]":labelalert === "w" ? "bg-[#ffc021]":"bg-[#fd355a]"} absolute bottom-0 left-0 w-full h-[4px]`}></span>
                </>
                :
                <>
                <div className={`bg-[#408ddc] w-[10px] h-full`}></div>
                <div className="flex items-center gap-[10px] p-[0_10px] w-full">
                    <div className={`bg-[#408ddc] w-[35px] h-[35px] rounded-[100%] flex justify-center items-center shrink-0`}>
                        <i className="fa-solid fa-question text-[25px] font-bold text-white"></i>
                    </div>
                    <div className="flex items-center grow-[1] justify-between">
                        <p className="text-[14px]">{textalert}</p>
                        <div className="flex gap-[10px]">
                            <div onClick={() => closeConfirm()} className="text-[14px] text-[#4ad369] cursor-pointer">ยกเลิก</div>
                            <div onClick={() => setisconfirmalert("ok")} className="text-[14px] text-[#fd355a] cursor-pointer">ลบเลย</div>
                        </div>
                    </div>
                </div>
                <span className={`bg-[#408ddc] absolute bottom-0 left-0 w-full h-[4px]`}></span>
                </>
            }
        </div>
    );
}