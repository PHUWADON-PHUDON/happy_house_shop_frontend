import { Link } from "react-router-dom";

export default function Menageproduct() {
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
                    <div className="grid grid-cols-7 text-center items-center justify-items-center mt-[10px] text-[#585858]">
                        <img className="w-[80px] h-[80px] block" src="https://plus.unsplash.com/premium_photo-1731948133366-0d1dbb7db851?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw2fHx8ZW58MHx8fHx8" alt="" />
                        <p>lay</p>
                        <p>123456789</p>
                        <p>20</p>
                        <p>50</p>
                        <p>ขนม</p>
                        <div className="flex gap-[20px] justify-center items-center">
                            <Link to={""} className="text-[#fece02]">
                                <i className="fa-solid fa-pencil"></i>
                            </Link>
                            <i className="fa-solid fa-trash text-[red] cursor-pointer"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}