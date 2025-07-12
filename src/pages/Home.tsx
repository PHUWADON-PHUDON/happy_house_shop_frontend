import { useState,useEffect, useRef } from "react";
import noimg from "../assets/noimage.jpg";
import axios from "axios";
import Alert from "../components/Alert";

interface CategoryType {
    id:number;
    name:string;
}

interface ProductType {
    id:number;
    name:string;
    barcode:string;
    price:number
    stock:number;
    description:string
    image:string;
    category:CategoryType;
}

interface ProductInfoType {
    id:number;
    name:string;
    price:number;
    stock:number;
    quantity:number;
    total:number
}

export default function Home() {
    const [barcode, setbarcode] = useState<string>("");
    const [allproduct,setallproduct] = useState<ProductType[]>([]);
    const [allproductinfo,setallproductinfo] = useState<ProductInfoType[]>([]);
    const [clickmoreoption,setclickmoreoption] = useState<boolean>(false);
    const [quantity,setquantity] = useState<number>(0);
    const [isalert,setisalert] = useState<boolean>(false);
    const [isconfirmalert,setisconfirmalert] = useState<string>("cancel"); //status cancel,on,ok
    const indexmoreoption = useRef<number>(0);
    const totalref = useRef<number>(0);
    const textalertref = useRef<string>("");
    const labelalertref = useRef<string>("");
    const typealertref = useRef<string>("");
    const url = import.meta.env.VITE_URLBACKEND;

    //!function

    //alert controller
    const alert = (text:string,label:string,type:string) => {
        if (isalert) {
            setisalert(false);
            const time = setTimeout(() => {
                textalertref.current = text;
                labelalertref.current = label;
                typealertref.current = type;

                if (type === "confirm") {
                    setisconfirmalert("on");
                }

                setisalert(true)
                return () => clearTimeout(time);
            },200);
        }
        else {
            textalertref.current = text;
            labelalertref.current = label;
            typealertref.current = type;

            if (type === "confirm") {
                setisconfirmalert("on");
            }

            setisalert(false);
            const time = setTimeout(() => {
                setisalert(true)
                return () => clearTimeout(time);
            },200);
        }
    }

    //!

    //!scan

    useEffect(() => {
        const abortcontroller = new AbortController();

        const handleBarcode = async (event:any) => {
            if (/[0-9]/.test(event.key)) {
                setbarcode((prev) => prev + event.key);
            }
            else if (event.key === "Enter") {
                try{
                    setbarcode("");

                    if (barcode !== "") {
                        const res = await axios.get(url + "/product/searchbarcode/" + barcode);

                        if (res.status === 200) {
                            if (res.data !== "") {
                                const arrproductinfo = [...allproductinfo];
                                const findinfo = allproductinfo.find((e) => e.id === res.data.id);
                                totalref.current += res.data.price;

                                if (findinfo) {
                                    const findindexinfo = arrproductinfo.indexOf(findinfo);
                                    allproductinfo[findindexinfo].quantity = allproductinfo[findindexinfo].quantity + 1;
                                    allproductinfo[findindexinfo].total = allproductinfo[findindexinfo].total + res.data.price;

                                    setallproductinfo((prev) => [...arrproductinfo]);
                                }
                                else {
                                    setallproduct((prev) => [...prev,res.data]);
                                    setallproductinfo((prev) => [...prev,{id:res.data.id,name:res.data.name,price:res.data.price,stock:res.data.stock,quantity:1,total:res.data.price}]);
                                }
                            }
                            else {
                                alert("ไม่พบสนค้านี้ในฐานข้อมูล","w","");
                            }
                        }
                    }
                    else {
                        alert("โอ้ะ ถ้าใช้เครื่องสะแกน แล้วรหัสสินค้าไม่ขึ้น ลองเปลี่ยนเป็นภาษา อังกฤษ ดู","w","");
                    }
                }
                catch(err) {
                    console.log(err);
                }
            }
        }

        window.addEventListener("keydown",handleBarcode);

        return () => {
            window.removeEventListener("keydown",handleBarcode);
            abortcontroller.abort();
        };
    },[barcode]);

    //!

    //!set quantity and price

    const setQuantity = (index:number,value:number) => {
        if (value > 0) {
            const arrproductinfo = [...allproductinfo];
            let newtotalref = 0;
            arrproductinfo[index].quantity = value;
            arrproductinfo[index].total = value * arrproductinfo[index].price;
            
            arrproductinfo.forEach(e => {
                newtotalref += e.total;
            });
            totalref.current =newtotalref;
            
            setallproductinfo(prev => [...arrproductinfo]);
        }
    }

    //!

    //!click more option

    const moreOption = (index:number) => {
        indexmoreoption.current = index;

        setclickmoreoption(!clickmoreoption);
    }

    //!

    //!clear order

    const clearOrder = () => {
        if (allproduct.length > 0) {
            alert("ต้องการลบ ใช่ หรือ ไม่","","confirm");
        }
    }

    useEffect(() => {
        if (isconfirmalert === "ok") {
            totalref.current = 0;

            setallproduct([]);
            setallproductinfo([]);
            setisconfirmalert("cancel");
            setisalert(false);
        }
    },[isconfirmalert]);

    //!

    //!end of sale

    const endOfSale = async () => {
        try{
            const res = await axios.post(url + "/product/endofsale",{allproductinfo:allproductinfo});

            if (res.status === 201) {
                totalref.current = 0;

                alert("จบการขายสำเร็จ","s","");
                setallproduct([]);
                setallproductinfo([]);
                setisconfirmalert("cancel");
            }
        }
        catch(err) {
            console.log(err);
        }
    }

    //!

    //!delete product

    const deleteProduct = (index:number) => {
        const arrallproductinfo = [...allproductinfo];
        const arrallproduct = [...allproduct];
        const newarrallproductinfo = arrallproductinfo.filter((_,i) => i !== index);
        const newarrallproduct = arrallproduct.filter((_,i) => i !== index);

        totalref.current -= arrallproductinfo[index].total;

        setallproductinfo(prev => [...newarrallproductinfo]);
        setallproduct(prev => [...newarrallproduct]);
    }

    //!

    return(
        <>
        <Alert isalert={isalert} setisalert={setisalert} textalert={textalertref.current} labelalert={labelalertref.current} typealert={typealertref.current} setisconfirmalert={setisconfirmalert}/>
        <div className="h-full flex">
            <div className="w-[75%] overflow-y-scroll">
                <div className="w-full flex flex-wrap gap-[10px]">
                    {allproduct.map((e,i:number) => (
                        <div key={i} className="w-[140px] h-[180px] bg-white rounded-[8px] p-[5px] flex flex-col justify-between items-center gap-[5px]">
                            {e.image ? 
                                <img className="w-[90px] h-[90px] block" src={`${url}/uploads/${e.image}`} alt="" />
                                :
                                <img className="w-[90px] h-[90px] block" src={noimg} alt="" />
                            }
                            <p className="text-center">{e.name}</p>
                            <p className="font-bold">{e.price} บาท</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-[25%] bg-white flex flex-col p-[10px] rounded-[4px]">
                <div className="h-[85%] overflow-y-scroll">
                    {allproductinfo.map((e,i:number) => (
                        <div key={i} className="p-[10px] bg-[#f5f5f5] rounded-[4px] mb-[10px]">
                            <div className="flex justify-between">
                                <div className="flex items-center gap-[10px]">
                                    <i onClick={() => moreOption(i)} className={`${clickmoreoption && indexmoreoption.current === i ? "rotate-[90deg]":""} fa-solid fa-angle-right text-[15px] duration-[0.2s] cursor-pointer`}></i>
                                    <p>{e.quantity}</p>
                                    <p>{e.name}</p>
                                </div>
                                <div className="flex items-center gap-[15px]">
                                    <p>{e.total} ฿</p>
                                    <i onClick={() => deleteProduct(i)} className="fa-solid fa-trash-can text-[12px] cursor-pointer"></i>
                                </div>
                            </div>
                            <div className={`${clickmoreoption && indexmoreoption.current === i ? "showmoreoption":""} duration-[0.2s] pl-[20px] h-[0] overflow-hidden`}>
                                <p className="text-[15px]">จำนวน</p>
                                <input onChange={(e) => setQuantity(i,Number(e.target.value))} value={e.quantity} type="number" min={1} className="w-full bg-white rounded-[4px] pl-[10px] focus:outline-none"/>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="grow-[1]">
                    <div className="flex justify-between">
                        <p>ทั้งหมด</p>
                        <p>{totalref.current} ฿</p>
                    </div>
                    <div className="flex gap-[10px] mt-[20px]">
                        <div onClick={() => clearOrder()} className="w-1/2 p-[10px_0] rounded-[4px] text-white font-bold cursor-pointer text-center bg-[#f1662a]">ละทิ้ง</div>
                        <div onClick={() => endOfSale()} className="w-1/2 p-[10px_0] rounded-[4px] text-white font-bold cursor-pointer text-center bg-[#31b84b]">จบการขาย</div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}