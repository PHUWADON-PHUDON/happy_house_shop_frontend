import { LineChart, Line } from 'recharts';

interface PropType {
    data:{date:string,sales:number}[]
}

export default function Tinylinechart({data}:PropType) {

    return(
        <div className="absolute right-0 p-[5px] bottom-0">
            <LineChart width={100} height={40} data={data}>
                <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#fff"
                    strokeWidth={2}
                    dot={false} // ซ่อนจุดบนเส้น
                />
            </LineChart>
        </div>
    );
}