import moment from "moment";
import { RefObject } from "react";

interface Typeproducts {
    name:string;
    quantity:number;
    total:number;
}

interface Typeprops {
    isPopEndOfSale:() => void;
    allproductinfo:Typeproducts[];
    total:number;
    endOfsale:() => void;
    receiptref:RefObject<HTMLDivElement>;
}

export default function Endofsale({isPopEndOfSale,allproductinfo,total,endOfsale,receiptref}:Typeprops) {
    return(
        <div className="flex absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] bg-white rounded-[8px] p-[20px] h-[350px] shadow-[0_0_50px_#d6d6d6]">
            <div ref={receiptref} id="receipt" className="p-[10px_20px] overflow-scroll">
                <h2>ร้านค้า Happy House Shop</h2>
                <p>วันที่: {moment().format("DD/MM/YYYY")} เวลา: {moment().format("HH:mm")}</p>
                <br/>
                <hr/>
                <br/>
                {allproductinfo.map((e,i) => (
                    <div key={i} className="flex justify-between items-center gap-[10px] mb-[5px]">
                        <p className="w-[200px]">{e.name} x{e.quantity}</p>
                        <p>฿{e.total}</p>
                    </div>
                ))}
                <br/>
                <hr/>
                <br/>
                <div className="flex justify-between">
                    <p>รวม</p>
                    <p>฿{total}</p>
                </div>
                <p>ขอบคุณที่ใช้บริการ</p>
            </div>
            <div className="flex flex-col justify-between">
                <div>
                    
                </div>
                <div className="flex gap-[10px]">
                    <div onClick={() => isPopEndOfSale()} className="w-[150px] p-[8px_0] rounded-[4px] text-white font-bold cursor-pointer text-center bg-[#f1662a]">ยกเลิก</div>
                    <div onClick={() => endOfsale()} className="w-[150px] p-[8px_0] rounded-[4px] text-white font-bold cursor-pointer text-center bg-[#31b84b]">ยืนยัน</div>
                </div>
            </div>
        </div>
    );
}