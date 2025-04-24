import { useState,useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import noimage from "../assets/noimage.jpg";
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

export default function Menageproduct() {
    const [allproduct,setallproduct] = useState<ProductType[]>([]);
    const [inputsearch,setinputsearch] = useState<string>("");
    const [isalert,setisalert] = useState<boolean>(false);
    const [isconfirmalert,setisconfirmalert] = useState<string>("cancel"); //status cancel,on,ok
    const [isclickdel,setisclickdel] = useState<boolean>(false);
    const textalertref = useRef<string>("");
    const labelalertref = useRef<string>("");
    const typealertref = useRef<string>("");
    const getiditemref = useRef<number>(0);
    const getindexitemsref = useRef<number>(0);
    const navigate = useNavigate();
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

    //!load data
    
    useEffect(() => {
        const abortcontroller = new AbortController();

        const loaddata = async () => {
            const res = await axios.get(url + "/product");

            if (res.status === 200) {
                setallproduct([...res.data]);
            }
        }
    
        loaddata();

        return () => abortcontroller.abort();
    },[]);

    //!

    //!click delete

    const clickDel = (id:number,index:number) => {
        getiditemref.current = id;
        getindexitemsref.current = index;

        setisclickdel(!isclickdel);
    }

    useEffect(() => {
        if (isclickdel) {
            alert("ต้องการลบสินค้านี้ ใช่ หรือ ไม่","","confirm");
        }
        else {
            setisalert(false);
        }
    },[isclickdel]);

    useEffect(() => {
        const abortcontroller = new AbortController();

        const delcategory = async () => {
            if (isconfirmalert === "ok") {
                try{
                    const res = await axios.delete(url + "/product/" + getiditemref.current);
                    
                    if (res.status === 200) {
                        const newarrallcategory = allproduct.filter((_,i:number) => i !== getindexitemsref.current);

                        setallproduct((prev) => [...newarrallcategory]);
                        setisconfirmalert("cancel");
                        setisclickdel(false);
                        alert("ลบสินค้าสำเร็จ","s","");
                    }
                }
                catch(err) {
                    setisconfirmalert("cancel");
                    setisclickdel(false);
                    alert("ลบสินค้าไม่สำเร็จ","f","");
                    console.log(err);
                }
            }
            else if (isconfirmalert === "on") {
                setisclickdel(true);
            }
            else {
                setisclickdel(false);
            }
        }

        delcategory();

        return () => abortcontroller.abort();
    },[isconfirmalert]);

    //!

    //!search category

    const getstrsearch = (value:string) => {
        if (value !== "") {
            navigate("/manageproduct?search=" + value);
        }
        else {
            navigate("/manageproduct");
        }
        setinputsearch(value);
    }

    useEffect(() => {
        const abortcontroller = new AbortController();

        const search = async () => {
            try{
                const res = await axios.get(url + "/product/search?search=" + inputsearch,{signal:abortcontroller.signal});

                if (res.status === 200) {
                    setallproduct((prev) => [...res.data]);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        search();

        return () => abortcontroller.abort();
    },[inputsearch]);

    //!

    return(
        <>
        <Alert isalert={isalert} setisalert={setisalert} textalert={textalertref.current} labelalert={labelalertref.current} typealert={typealertref.current} setisconfirmalert={setisconfirmalert}/>
        <div className="w-full h-full bg-[#fff] rounded-[4px] p-[10px]">
            <div className="flex justify-between items-center">
                <input onChange={(e) => getstrsearch(e.target.value)} type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ค้นหาสินค้า" />
                <div className="flex gap-[10px]">
                    <Link to={"/manageproduct/insertproduct"} className="bg-[#f1662a] w-[120px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px]">
                        <i className="fa-solid fa-plus"></i> เพิ่มสินค้า
                    </Link>
                    <Link to={"/manageproduct/managecategory"} className="bg-[#408ddc] w-[120px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px]">
                        <i className="fa-solid fa-plus"></i> เพิ่มประเภท
                    </Link>
                </div>
            </div>
            <div className="tablestyle w-full flex flex-col">
                <div className="grid grid-cols-7 text-center bg-[#09aa29d6] p-[5px_0] mt-[10px] rounded-[4px] text-white">
                    <p>รูป</p>
                    <p>ชื่อสินค้า</p>
                    <p>รหัสสินค้า</p>
                    <p>ราคา</p>
                    <p>คงเหลือ</p>
                    <p>หมวดหมู่</p>
                    <p>การจัดการ</p>
                </div>
                <div className="grow-[1] overflow-y-scroll">
                    {allproduct.map((e,i:number) => (
                        <div key={i} className="grid grid-cols-7 text-center items-center justify-items-center mt-[10px] text-[#585858]">
                            {e.image ? 
                                <img className="w-[80px] h-[80px] block" src={url + "/uploads/" + e.image} alt="" />
                                :
                                <img className="w-[80px] h-[80px] block" src={noimage} alt="" />
                            }
                            <p>{e.name}</p>
                            <p>{e.barcode}</p>
                            <p>{e.price}</p>
                            <p>{e.stock}</p>
                            <p>{e.category.name}</p>
                            <div className="flex gap-[20px] justify-center items-center">
                                <Link to={`/manageproduct/updateproduct/${e.id}`} className="text-[#fece02]">
                                    <i className="fa-solid fa-pencil"></i>
                                </Link>
                                <i onClick={() => clickDel(e.id,i)} className={`${isclickdel && getindexitemsref.current === i ? "text-[#408ddc]":"text-[red]"} fa-solid fa-trash cursor-pointer`}></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}