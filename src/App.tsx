import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Manageproduct from './pages/Manageproduct';
import Managecategory from './pages/Managecategory';
import Insertproduct from './pages/Insertproduct';

function App() {
  return(
    <div className="h-[100dvh] flex gap-[10px] bg-[#f5f5f5] p-[10px]">
      <Router>
        <nav className="w-[80px] p-[20px_5px] flex justify-center bg-[#fff]">
          <ul className="w-[100%]">
            <li className="w-[100%] h-[60px]">
              <Link to={"/"} className="hovermenu w-full h-full flex justify-center items-center rounded-[4px] flex-col hover:border-[2px] mt-[20px] hover:border-[#f1662a] hover:bg-[#fdb0766a]">
                <i className="fa-solid fa-house text-[20px] text-[#aeaeae]"></i>
                <p className="text-[12px] text-[#aeaeae]">หน้าหลัก</p>
              </Link>
              <Link to={"/manageproduct"} className="hovermenu w-full h-full flex justify-center items-center rounded-[4px] flex-col hover:border-[2px] mt-[20px] hover:border-[#f1662a] hover:bg-[#fdb0766a]">
                <i className="fa-solid fa-pen-to-square text-[20px] text-[#aeaeae]"></i>
                <p className="text-[12px] text-[#aeaeae]">จัดการสินค้า</p>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="grow-[1]">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/manageproduct" element={<Manageproduct/>} />
            <Route path="/manageproduct/managecategory" element={<Managecategory/>} />
            <Route path="/manageproduct/insertproduct" element={<Insertproduct/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
