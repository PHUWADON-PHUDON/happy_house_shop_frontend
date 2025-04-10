import { useNavigate,Link } from "react-router-dom";

export default function Managecategory() {
    const navigate = useNavigate();

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
                        <div className="grid grid-cols-3 text-center p-[10px_0] text-[#585858]">
                            <p>1</p>
                            <p>เครื่องดื่ม</p>
                            <div className="flex gap-[20px] justify-center items-center">
                                <Link to={""} className="text-[#fece02]">
                                    <i className="fa-solid fa-pencil"></i>
                                </Link>
                                <i className="fa-solid fa-trash text-[red] cursor-pointer"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2">
                    <p className="mt-[10px] text-[25px] text-[#585858] font-bold text-center">เพิ่มประเภทสินค้า</p>
                    <input type="text" className="border-[1px] block m-[10px_auto] border-[#aeaeae] rounded-[20px] p-[2px_10px] w-[300px] h-[30px] focus:outline-none" placeholder="ใส่ประเภทสินค้าที่ต้องการเพิ่ม"/>
                    <button className="bg-[#408ddc] m-[10px_auto] w-[120px] h-[30px] rounded-[4px] text-white flex justify-center items-center gap-[10px] cursor-pointer">เพิ่มลงฐานข้อมูล</button>
                </div>
            </div>
        </div>
    );
}