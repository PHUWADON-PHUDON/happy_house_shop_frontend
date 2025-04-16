import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import noimage from "../assets/noimage.jpg";

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
    const url = import.meta.env.VITE_URLBACKEND;

    //!load data
    
    useEffect(() => {
        const abortcontroller = new AbortController();

        const loaddata = async () => {
            const res = await axios.get(url + "/product");

            if (res.status === 200) {
                setallproduct(res.data);
            }
        }
    
        loaddata();

        return () => abortcontroller.abort();
    },[]);

    //!

    return(
        <div className="w-full h-full bg-[#fff] rounded-[4px] p-[10px]">
            <div className="flex justify-between items-center">
                <input type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ค้นหาสินค้า" />
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
                                <Link to={""} className="text-[#fece02]">
                                    <i className="fa-solid fa-pencil"></i>
                                </Link>
                                <i className="fa-solid fa-trash text-[red] cursor-pointer"></i>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}