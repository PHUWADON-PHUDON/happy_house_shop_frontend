import { useState,useEffect,useCallback,useRef } from "react";
import { useNavigate,useSearchParams } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert";

interface CategoryType {
    id:number;
    name:string;
}

export default function Managecategory() {
    const [inputcategory,setinputcategory] = useState<string>("");
    const [inputsearch,setinputsearch] = useState<string>("");
    const [allcategory,setallcategory] = useState<CategoryType[]>([]);
    const [isclickedit,setisclickedit] = useState<boolean>(false);
    const [isclickdel,setisclickdel] = useState<boolean>(false);
    const [inputeditcategory,setinputeditcategory] = useState<string>("");
    const [isalert,setisalert] = useState<boolean>(false);
    const [isconfirmalert,setisconfirmalert] = useState<string>("cancel"); //status cancel,on,ok
    const textalertref = useRef<string>("");
    const labelalertref = useRef<string>("");
    const typealertref = useRef<string>("");
    const createcategoryabortref = useRef<AbortController | null>(null);
    const getiditemref = useRef<number>(0);
    const getindexitemsref = useRef<number>(0);
    const navigate = useNavigate();
    const [searchparam] = useSearchParams();
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
            try{
                const res = await axios.get(url + "/category",{signal:abortcontroller.signal});
                
                if (res.status === 200) {
                    setallcategory(res.data);
                }
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
                const res = await axios.post(url + "/category",{name:inputcategory},{signal:createcategoryabortref.current.signal});

                if (res.status === 201) {
                    alert("เพิ่มประเภทสินค้าสำเร็จ","s","");
                    setallcategory((prev) => [...prev,res.data]);
                    setinputcategory("");
                }
            }
            else {
                alert("ต้องใส่ข้อมูลในช่องใส่ข้อมูลก่อน","w","");
            }
        }
        catch(err) {
            alert("เพิ่มประเภทสินค้าไม่สำเร็จ","f","");
            console.log(err);
        }
    };

    //!

    //!click edit

    const clickEdit = (index:number,value:string) => {
        getindexitemsref.current = index; 

        setisclickedit(!isclickedit);
        setinputeditcategory(value);
        setisalert(false);
        setisclickdel(false);
    }

    const sendEditCategory = async (id:number,index:number) => {
        try{
            if (inputeditcategory !== "") {
                const res = await axios.patch(url + "/category/" + id,{name:inputeditcategory});

                if (res.status === 200) {
                    const arrallcategory = allcategory;
                    arrallcategory[index].name = res.data.name;

                    alert("แก้ไขประเภทสินค้าสำเร็จ","s","");
                    setallcategory((prev) => [...arrallcategory]);
                    setisclickedit(false);
                }
            }
        }
        catch(err) {
            alert("แก้ไขประเภทสินค้าไม่สำเร็จ","f","");
            console.log(err);
        }
    }

    //!

    //!click delete

    const clickDel = (id:number,index:number) => {
        getiditemref.current = id;
        getindexitemsref.current = index;

        setisclickdel(!isclickdel);
        setisclickedit(false);
    }

    useEffect(() => {
        if (isclickdel) {
            alert("ต้องการลบประเภทสินค้านี้ ใช่ หรือ ไม่","","confirm");
        }
        else {
            setisalert(false)
        }
    },[isclickdel]);

    useEffect(() => {
        const abortcontroller = new AbortController();

        const delcategory = async () => {
            if (isconfirmalert === "ok") {
                try{
                    const res = await axios.delete(url + "/category/" + getiditemref.current);
                    
                    if (res.status === 200) {
                        const newarrallcategory = allcategory.filter((_,i:number) => i !== getindexitemsref.current);

                        setallcategory((prev) => [...newarrallcategory]);
                        setisconfirmalert("cancel");
                        setisclickdel(false);
                        alert("ลบประเภทสินค้าสำเร็จ","s","");
                    }
                }
                catch(err) {
                    setisconfirmalert("cancel");
                    setisclickdel(false);
                    alert("ลบประเภทสินค้าไม่สำเร็จ","f","");
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
            navigate("/manageproduct/managecategory?search=" + value);
        }
        else {
            navigate("/manageproduct/managecategory");
        }
        setinputsearch(value);
    }

    useEffect(() => {
        const abortcontroller = new AbortController();

        const search = async () => {
            try{
                const res = await axios.get(url + "/category/search?search=" + inputsearch,{signal:abortcontroller.signal});

                if (res.status === 200) {
                    setallcategory((prev) => [...res.data]);
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
                <div className="flex items-center gap-[20px]">
                    <i onClick={() => navigate("/manageproduct")} className="fa-regular fa-circle-left text-[25px] text-[#aeaeae] cursor-pointer hover:text-[#f1662a]"></i>
                    <input onChange={(e) => getstrsearch(e.target.value)} type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ค้นหาประเภทสินค้า" />
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
                                        <div onClick={() => clickEdit(i,e.name)} className="cursor-pointer">
                                            <i className={`${isclickedit && getindexitemsref.current === i ? "text-[#408ddc]":"text-[#fece02]"} fa-solid fa-pencil`}></i>
                                        </div>
                                        <i onClick={() => clickDel(e.id,i)} className={`${isclickdel && getindexitemsref.current === i ? "text-[#408ddc]":"text-[red]"} fa-solid fa-trash cursor-pointer`}></i>
                                    </div>
                                </div>
                                <div className={`${isclickedit && getindexitemsref.current === i ? "showeditbox":""} bg-white flex justify-center items-center gap-[10px] overflow-hidden h-[0] duration-[0.2s]`}>
                                    <input onChange={(e) => setinputeditcategory(e.target.value)} value={inputeditcategory} type="text" className="border-[1px] block m-[10px_0] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ประเภทสินค้า"/>
                                    <div onClick={() => sendEditCategory(e.id,i)} className="bg-[#31b84b] m-[10px_0] w-[50px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px] cursor-pointer">ตกลง</div>
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
        </>
    );
}