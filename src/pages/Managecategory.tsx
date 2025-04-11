import { useState,useEffect,useCallback,useRef } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";

interface CategoryType {
    id:number;
    name:string;
}

export default function Managecategory() {
    const [inputcategory,setinputcategory] = useState<string>("");
    const [allcategory,setallcategory] = useState<CategoryType[]>([]);
    const [isclickedit,setisclickedit] = useState<boolean>(false);
    const createcategoryabortref = useRef<AbortController | null>(null);
    const getindexitemsref = useRef<number>(0);
    const navigate = useNavigate();

    //!load data

    useEffect(() => {
        const abortcontroller = new AbortController();

        const loaddata = async () => {
            try{
                const res = await axios.get(import.meta.env.VITE_URLBACKEND + "/category",{signal:abortcontroller.signal});
                
                setallcategory(res.data);
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddata();

        return () => abortcontroller.abort();
    },[]);

    //!

    //!create category

    const createCategory = async () => {
        if (createcategoryabortref.current) {
            createcategoryabortref.current.abort();
        }

        createcategoryabortref.current = new AbortController();

        try{
            if (inputcategory !== "") {
                const res = await axios.post(import.meta.env.VITE_URLBACKEND + "/category",{name:inputcategory},{signal:createcategoryabortref.current.signal});
            
                setallcategory((prev) => [...prev,res.data]);
                setinputcategory("");
            }
        }
        catch(err) {
            console.log(err);
        }
    };

    //!

    //!click edit

    const clickEdit = (index:number) => {
        getindexitemsref.current = index; 

        setisclickedit(!isclickedit);
    }

    //!

    return(
        <div className="w-full h-full bg-[#fff] rounded-[4px] p-[10px]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-[20px]">
                    <i onClick={() => navigate(-1)} className="fa-regular fa-circle-left text-[25px] text-[#aeaeae] cursor-pointer hover:text-[#f1662a]"></i>
                    <input type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ค้นหาประเภทสินค้า" />
                </div>
            </div>
            <div className="tablestyle w-full flex gap-[10px]">
                <div className="w-1/2 flex flex-col">
                    <div className="grid grid-cols-3 text-center bg-[#09aa29d6] p-[5px_0] mt-[10px] rounded-[4px] text-white">
                        <p>ลำดับ</p>
                        <p>ประเภท</p>
                        <p>การจัดการ</p>
                    </div>
                    <div className="grow-[1] overflow-y-scroll">
                        {allcategory.map((e,i) => (
                            <div key={i}>
                                <div className="grid grid-cols-3 text-center p-[10px_0] text-[#585858]">
                                    <p>{i + 1}</p>
                                    <p>{e.name}</p>
                                    <div className="flex gap-[20px] justify-center items-center">
                                        <div onClick={() => clickEdit(i)} className="text-[#fece02] cursor-pointer">
                                            <i className={`${isclickedit && getindexitemsref.current === i ? "text-[#408ddc]":""} fa-solid fa-pencil`}></i>
                                        </div>
                                        <i className="fa-solid fa-trash text-[red] cursor-pointer"></i>
                                    </div>
                                </div>
                                <div className={`${isclickedit && getindexitemsref.current === i ? "showeditbox":""} bg-white flex justify-center items-center gap-[10px] overflow-hidden h-[0] duration-[0.2s]`}>
                                    <input type="text" className="border-[1px] block m-[10px_0] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ประเภทสินค้า"/>
                                    <div className="bg-[#31b84b] m-[10px_0] w-[50px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px] cursor-pointer">ตกลง</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2">
                    <p className="mt-[10px] text-[25px] text-[#585858] font-bold text-center">เพิ่มประเภทสินค้า</p>
                    <input onChange={(e) => setinputcategory(e.target.value)} value={inputcategory} type="text" className="border-[1px] block m-[10px_auto] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ประเภทสินค้าที่ต้องการเพิ่ม"/>
                    <div onClick={() => createCategory()} className="bg-[#408ddc] m-[10px_auto] w-[120px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px] cursor-pointer">เพิ่มลงฐานข้อมูล</div>
                </div>
            </div>
        </div>
    );
}