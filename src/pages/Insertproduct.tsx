import { useState,useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";

export default function Insertproduct() {
    const [barcode,setbarcode] = useState<string>("");
    const [inputproductname,setinputproductname] = useState<string>("");
    const [inputprice,setinputprice] = useState<number>(0);
    const [inputstock,setinputstock] = useState<number>(0);
    const [inputfile,setinputfile] = useState<File>();
    const [previewfile,setpreviewfile] = useState<string>("");
    const [isalert,setisalert] = useState<boolean>(false);
    const [isconfirmalert,setisconfirmalert] = useState<string>("cancel"); //status cancel,on,ok
    const barcoderef = useRef<string>("");
    const textalertref = useRef<string>("");
    const [textalert,settextalert] = useState<string>("");
    const navigate = useNavigate();

    //!scan

    useEffect(() => {
        const handleBarcode = (event:any) => {
            if (/[0-9]/.test(event.key)) {
                barcoderef.current += event.key;
            }
            else if (event.key === "Enter") {
                setbarcode(barcoderef.current);

                if (barcoderef.current === "") {
                    setisalert(false);
                    const time = setTimeout(() => {
                        setisalert(true);
                    
                        return () => clearTimeout(time);
                    },200);

                    textalertref.current = "โอ้ะ ถ้าใช้เครื่องสะแกน แล้วรหัสสินค้าไม่ขึ้น ลองเปลียนเป็นภาษา อังกฤษ ดู";
                }
        
                barcoderef.current = "";
            }
        }

        window.addEventListener("keydown",handleBarcode);

        return () => {
            window.removeEventListener("keydown",handleBarcode);
        };
    },[barcode]);

    //!

    //!input file

    const handleFile = (event:any) => {
        const file_:File = event.target.files![0];
        
        if (file_) {
            const createurl = URL.createObjectURL(file_);

            setinputfile(file_);
            setpreviewfile(createurl);
        }
    }

    //!

    //!send data to backend

    const checkInput = () => {
        if (barcode === "" || inputproductname === "" ||
            inputprice === 0 || inputstock === 0
        ) {
            textalertref.current = "ต้องใส่ข้อมูลในช่องใส่ข้อความที่มีเครื่องหมาย * ให้ครบ";
            setisalert(false);
            const time = setTimeout(() => {
                setisalert(true);

                return () => clearTimeout(time);
            },200);

            return(false);
        }
        else {
            setisalert(false);
            return(true);
        }
    }

    const insertData = () => {
        if (checkInput()) {
            //
        }
    }

    console.log(textalert);

    //!

    return(
        <>
        <Alert isalert={isalert} setisalert={setisalert} textalert={textalertref.current} labelalert={"w"} typealert={""} setisconfirmalert={setisconfirmalert}/>
        <div className="w-full h-full bg-[#fff] rounded-[4px] p-[10px]">
            <div className="h-[30px] flex justify-between items-center">
                <div className="flex items-center gap-[20px]">
                    <i onClick={() => navigate(-1)} className="fa-regular fa-circle-left text-[25px] text-[#aeaeae] cursor-pointer hover:text-[#f1662a]"></i>
                </div>
            </div>
            <div className="tablestyle w-full flex gap-[10px] p-[20px_10px]">
                <div className="flex items-center flex-col gap-[10px]">
                    <div>
                        <p className="ml-[10px]">รหัสสินค้า <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setbarcode(e.target.value)} value={barcode} type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่รหัสสินค้า" />
                    </div>
                    <div>
                        <p className="ml-[10px]">ชื่อสินค้า <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setinputproductname(e.target.value)} type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ชื่อสินค้า" />
                    </div>
                    <div>
                        <p className="ml-[10px]">ราคา <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setinputprice(Number(e.target.value))} type="number" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ราคา" />
                    </div>
                    <div>
                        <p className="ml-[10px]">จำนวนคงเหลือ <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setinputstock(Number(e.target.value))} type="number" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่จำนวนคงเหลือ" />
                    </div>
                    <div>
                        <p className="ml-[10px]">หมวดหมู่สินค้า <span className="text-[red]">*</span></p>
                        <select name="" id="" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none">
                            <option value="">a</option>
                            <option value="">b</option>
                            <option value="">c</option>
                        </select>
                    </div>
                    <div>
                        <p className="ml-[10px]">รูปภาพสินค้า</p>
                        <input onChange={(e:any) => handleFile(e)} type="file" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่จำนวนคงเหลือ" />
                    </div>
                    <div>
                        <p className="ml-[10px]">รายละเอียดเพิ่มเติม</p>
                        <input type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="รายละเอียดเพิ่มเติม" />
                    </div>
                    <div onClick={() => insertData()} className="bg-[#f1662a] w-[120px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px] mt-[20px] cursor-pointer">เพิ่มลงฐานข้อมูล</div>
                </div>
                <div className="grow-[1] flex justify-center">
                    <div className="border-dashed border-[4px] border-[#f1662a] bg-[#fdb0766a] w-[420px] h-[420px] relative">
                        <p className="text-[25px] text-[#f1662a] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[0]">ตัวอย่างรูป</p>
                        <img src={previewfile} alt="" className="w-full h-full relative z-[5]"/>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}