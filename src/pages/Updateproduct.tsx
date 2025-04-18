import { useState,useEffect,useRef } from "react";
import { useNavigate,useParams } from "react-router-dom";
import Alert from "../components/Alert";
import axios from "axios";

interface CategoryType {
    id:number;
    name:string;
}

export default function Updateproduct() {
    const [allcategory,setallcategory] = useState<CategoryType[]>([]);
    const [barcode,setbarcode] = useState<string>("");
    const [inputproductname,setinputproductname] = useState<string>("");
    const [inputprice,setinputprice] = useState<number>(0);
    const [inputstock,setinputstock] = useState<number>(0);
    const [inputcategoryid,setinputcategoryid] = useState<number>(0);
    const [inputfile,setinputfile] = useState<File | null>(null);
    const [previewfile,setpreviewfile] = useState<string>("");
    const [inputdescription,setinputdescription] = useState<string>("");
    const [isalert,setisalert] = useState<boolean>(false);
    const [isconfirmalert,setisconfirmalert] = useState<string>("cancel"); //status cancel,on,ok
    const barcoderef = useRef<string>("");
    const textalertref = useRef<string>("");
    const labelalertref = useRef<string>("");
    const typealertref = useRef<string>("");
    const inputfileref = useRef<any>(null);
    const abortcontrollerref = useRef<AbortController | null>(null);
    const navigate = useNavigate();
    const param = useParams();
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
        const abortcontroller2 = new AbortController();

        const loadcategorydata = async () => {
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

        const loadproductdata = async () => {
            try{
                const res = await axios.get(url + "/product/" + param.id,{signal:abortcontroller2.signal});

                if (res.status === 200) {
                    setbarcode(res.data.barcode);
                    setinputproductname(res.data.name);
                    setinputprice(res.data.price);
                    setinputstock(res.data.stock);
                    setinputcategoryid(res.data.categoryid);
                    setinputdescription(res.data.description);

                    if (res.data.image) {
                        setpreviewfile(res.data.image);
                    }
                }
            }
            catch(err) {
                console.log(err);
            }
        }


        loadcategorydata();
        loadproductdata();

        return () => {
            abortcontroller.abort();
            abortcontroller2.abort();
        };
    },[]);

    //!

    //!scan

    useEffect(() => {
        const handleBarcode = (event:any) => {
            if (/[0-9]/.test(event.key)) {
                barcoderef.current += event.key;
            }
            else if (event.key === "Enter") {
                setbarcode(barcoderef.current);

                if (barcoderef.current === "") {
                    alert("โอ้ะ ถ้าใช้เครื่องสะแกน แล้วรหัสสินค้าไม่ขึ้น ลองเปลียนเป็นภาษา อังกฤษ ดู","w","");
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
        const filetype = ["image/jpeg","image/jpg","image/png","image/webp"];

        if (file_) {
            if (filetype.includes(file_.type)) {
                const createurl = URL.createObjectURL(file_);
                
                setinputfile(file_);
                setpreviewfile(createurl);
            }
            else {
                alert("ต้องเป็นไฟล์รูปภาพเท่านั้น","w","");
            }
        }
    }

    //!

    //!send data to backend

    const checkInput = () => {
        if (barcode === "" || inputproductname === "" ||
            inputprice <= 0 || inputstock <= 0 ||
            inputcategoryid <= 0
        ) {
            alert("ต้องใส่ข้อมูลในช่องใส่ข้อความที่มีเครื่องหมาย * ให้ครบ","w","");

            return(false);
        }
        else {
            setisalert(false);
            return(true);
        }
    }

    const updateData = async () => {
        if (abortcontrollerref.current) {
            abortcontrollerref.current.abort();
        }

        abortcontrollerref.current = new AbortController();

        if (checkInput()) {
            try{
                const formdata = new FormData();
                formdata.append("barcode",barcode);
                formdata.append("name",inputproductname);
                formdata.append("price",inputprice + "");
                formdata.append("stock",inputstock + "");
                formdata.append("categoryid",inputcategoryid + "");
                if (inputfile) {
                    formdata.append("file",inputfile);
                }
                formdata.append("description",inputdescription);
                const res = await axios.patch(url + `/product/${param.id}`,formdata,{signal:abortcontrollerref.current.signal,headers:{'Content-Type': 'multipart/form-data'}});
                
                if (res.status === 200) {
                    alert("แก้ไขข้อมูลสำเร็จ","s","");
                }
            }
            catch(err:any) {
                if (err.response.data.message == "P2002") {
                    alert("รหัสสินค้านี้เคยถูกเพิ่มในฐานข้อมูลแล้ว","w","");
                }
                else {
                    alert("แก้ไขข้อมูลไม่สำเร็จ","f","");
                }

                console.log(err);
            }
        }
    }

    //!

    //!del preview file

    const delPreview = () => {
        inputfileref.current.value = null;

        setinputfile(null);
        setpreviewfile("");
    }

    //!
    
    return(
        <>
        <Alert isalert={isalert} setisalert={setisalert} textalert={textalertref.current} labelalert={labelalertref.current} typealert={typealertref.current} setisconfirmalert={setisconfirmalert}/>
        <div className="w-full h-full bg-[#fff] rounded-[4px] p-[10px]">
            <div className="h-[30px] flex justify-between items-center">
                <div className="flex items-center gap-[20px]">
                    <i onClick={() => navigate(-1)} className="fa-regular fa-circle-left text-[25px] text-[#aeaeae] cursor-pointer hover:text-[#f1662a]"></i>
                </div>
            </div>
            <div className="tablestyle w-full flex gap-[10px] p-[20px_10px]">
                <div className="w-[50%] flex items-center flex-col gap-[10px]">
                    <div>
                        <p className="ml-[10px]">รหัสสินค้า <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setbarcode(e.target.value)} value={barcode} autoFocus type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่รหัสสินค้า" />
                    </div>
                    <div>
                        <p className="ml-[10px]">ชื่อสินค้า <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setinputproductname(e.target.value)} value={inputproductname} type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ชื่อสินค้า" />
                    </div>
                    <div>
                        <p className="ml-[10px]">ราคา <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setinputprice(Number(e.target.value))} value={inputprice} type="number" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ราคา" />
                    </div>
                    <div>
                        <p className="ml-[10px]">จำนวนคงเหลือ <span className="text-[red]">*</span></p>
                        <input onChange={(e) => setinputstock(Number(e.target.value))} value={inputstock} type="number" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่จำนวนคงเหลือ" />
                    </div>
                    <div>
                        <p className="ml-[10px]">หมวดหมู่สินค้า <span className="text-[red]">*</span></p>
                        <select onChange={(e) => setinputcategoryid(Number(e.target.value))} value={inputcategoryid} name="" id="" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none">
                            <option value={0}>-</option>
                            {allcategory.map((e,i:number) => (
                                <option key={i} value={e.id}>{e.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p className="ml-[10px]">รูปภาพสินค้า</p>
                        <div>
                            <input ref={inputfileref} onChange={(e) => handleFile(e)} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่จำนวนคงเหลือ" />
                            {previewfile ? 
                                <i onClick={() => delPreview()} className="fa-solid fa-circle-xmark cursor-pointer ml-[10px] hover:text-[red]"></i>
                                :
                                ""
                            }
                        </div>
                    </div>
                    <div>
                        <p className="ml-[10px]">รายละเอียดเพิ่มเติม</p>
                        <input onChange={(e) => setinputdescription(e.target.value)} value={inputdescription} type="text" className="border-[1px] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="รายละเอียดเพิ่มเติม" />
                    </div>
                    <div onClick={() => updateData()} className="bg-[#f1662a] w-[120px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px] mt-[20px] cursor-pointer">แก้ไขข้อมูล</div>
                </div>
                <div className="w-[50%] flex justify-center">
                    <div className="border-dashed border-[4px] border-[#f1662a] bg-[#fdb0766a] w-[420px] h-[420px] relative">
                        <p className="text-[25px] text-[#f1662a] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[0]">ตัวอย่างรูป</p>
                        {previewfile.includes("http") ?
                            <img src={previewfile} alt="" className="w-full h-full relative z-[5]"/>
                            :
                            <img src={`${url}/uploads/${previewfile}`} alt="" className="w-full h-full relative z-[5]"/>
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}