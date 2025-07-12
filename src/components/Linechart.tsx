import { LineChart,Line,XAxis,YAxis,CartesianGrid } from 'recharts';

export default function Linechart() {
    const initialData = [
        { name: '1', sales: 100 },
        { name: '2', sales: 120 },
        { name: '3', sales: 90 },
        { name: '4', sales: 150 },
        { name: '5', sales: 200 },
    ];

    return(
        <div className="mt-[30px]">
            <LineChart width={window.innerWidth / 1.1} height={window.innerHeight / 1.33} data={initialData}>
                <CartesianGrid/>
                <YAxis />
                <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#fe832e"
                    strokeWidth={2}
                    dot={false} // ซ่อนจุดบนเส้น
                />
                <XAxis dataKey="name" />
            </LineChart>
        </div>
    );
}