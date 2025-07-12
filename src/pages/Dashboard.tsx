import { useState,useEffect,useRef } from "react"
import axios from "axios";
import Tinylinechart from "../components/Tinylinechart";
import Linechart from "../components/Linechart";
import moment from "moment";
import _ from "lodash";

interface HistoryType {
    id:number;
    productid:number;
    totalprice:number;
    quantity:number;
    createat:Date;
    updateat:Date;
}

export default function Dashboard() {
    const [todaysale,settodaysale] = useState<number>(0);
    const [monthsale,setmonthsale] = useState<number>(0);
    const [yearsale,setyearsale] = useState<number>(0);
    const [productamount,setproductamount] = useState<number>(0);
    const [todaysalechart,settodaysalechart] = useState<{date:string,sales:number}[]>([]);
    const [monthsalechart,setmonthsalechart] = useState<{date:string,sales:number}[]>([]);
    const [yearsalechart,setyearsalechart] = useState<{date:string,sales:number}[]>([]);
    const url = import.meta.env.VITE_URLBACKEND;

    //!function

    const calSales = (res:HistoryType[]) => {
        const datenow = new Date(Date.now());
        let todaysale:number = 0; 
        let monthsale:number = 0;
        let yearsale:number = 0;

        //get today's sales
        res.map((e:HistoryType) => {
            if (new Date(e.createat).getDay() === new Date(datenow).getDay() &&
                new Date(e.createat).getDate() === new Date(datenow).getDate() &&
                new Date(e.createat).getMonth() === new Date(datenow).getMonth() &&
                new Date(e.createat).getFullYear() === new Date(datenow).getFullYear()
            ) {
                todaysale += e.totalprice;
            }
        });

        //get month's sales
        res.map((e:HistoryType) => {
            if (new Date(e.createat).getMonth() === new Date(datenow).getMonth() &&
                new Date(e.createat).getFullYear() === new Date(datenow).getFullYear()
            ) {
                monthsale += e.totalprice;
            }
        });

        //get year's sales
        res.map((e:HistoryType) => {
            if (new Date(e.createat).getFullYear() === new Date(datenow).getFullYear()) {
                yearsale += e.totalprice;
            }
        });

        settodaysale(todaysale);
        setmonthsale(monthsale);
        setyearsale(yearsale);
        settodaysalechart(todaysalechart);
    }

    const calChart = (res:HistoryType[]) => {
        //day chart
        const cloneday = res.map((e:any,i) => {
            e.createat = moment(e.createat).format("YYYY-MM-DD");
            return(e);
        });
        const groupday = Object.entries(_.groupBy(cloneday,"createat"));
        const todaysalechart = groupday.map((e) => {
            let date:string = ""; let sales:number = 0;

            e[1].map((g) => {
                date = g.createat;
                sales += g.totalprice;
            });

            return({date:date,sales:sales});
        });

        //month chart
        const clonemonth = res.map((e:any,i) => {
            e.createat = moment(e.createat).format("YYYY-MM");
            return(e);
        });
        const groupmonth = Object.entries(_.groupBy(clonemonth,"createat"));
        const monthsalechart = groupmonth.map((e) => {
            let date:string = ""; let sales:number = 0;

            e[1].map((g) => {
                date = g.createat;
                sales += g.totalprice;
            });

            return({date:date,sales:sales});
        });

        //year chart
        const cloneyear = res.map((e:any,i) => {
            e.createat = moment(e.createat).format("YYYY");
            return(e);
        });
        const groupyear = Object.entries(_.groupBy(cloneyear,"createat"));
        const yearsalechart = groupyear.map((e) => {
            let date:string = ""; let sales:number = 0;

            e[1].map((g) => {
                date = g.createat;
                sales += g.totalprice;
            });

            return({date:date,sales:sales});
        });

        settodaysalechart(todaysalechart);
        setmonthsalechart(monthsalechart);
        setyearsalechart(yearsalechart);
    }

    //!
    
    //!load data

    useEffect(() => {
        const loaddatahistory = async () => {
            try{
                const res = await axios.get(url + "/product/gethistory");

                if (res.status === 200) {
                    calSales(res.data);
                    calChart(res.data);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        const loaddataproduct = async () => {
            try{
                const res = await axios.get(url + "/product");

                if (res.status === 200) {
                    const amount = res.data.map(() => " ");

                    setproductamount(amount.length);
                }
            }
            catch(err) {
                console.log(err);
            }
        }

        loaddatahistory();
        loaddataproduct();
    },[]);

    //!

    return(
        <>
        <div className="w-full h-full bg-[#fff] rounded-[4px] p-[10px]">
            <div className="grid grid-cols-4 gap-[10px]">
                <div className="h-[100px] bg-[#fe832e] text-white rounded-[4px] p-[10px] relative">
                    <p className="text-[18px]">ยอดขายวันนี้</p>
                    <p className="text-[20px] font-bold">{todaysale} ฿</p>
                    <Tinylinechart data={todaysalechart}/>
                </div>
                <div className="h-[100px] bg-[#00d9a6] text-white rounded-[4px] p-[10px] relative">
                    <p className="text-[18px]">ยอดขายรวมเดือนนี้</p>
                    <p className="text-[20px] font-bold">{monthsale} ฿</p>
                    <Tinylinechart data={monthsalechart}/>
                </div>
                <div className="h-[100px] bg-[#1a79eb] text-white rounded-[4px] p-[10px] relative">
                    <p className="text-[18px]">ยอดขายรวมทั้งหมด</p>
                    <p className="text-[20px] font-bold">{yearsale} ฿</p>
                    {/* <Tinylinechart data={yearsalechart}/> */}
                </div>
                <div className="h-[100px] bg-[#6d39d5] text-white rounded-[4px] p-[10px] relative">
                    <p className="text-[18px]">จำนวนสินค้าทั้งหมด</p>
                    <p className="text-[20px] font-bold">{productamount} ชิ้น</p>
                </div>
            </div>
            <div className="flex  not-odd:">
                <Linechart/>
            </div>
        </div>
        </>
    );
}