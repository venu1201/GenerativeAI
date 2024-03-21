import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineCloseSquare } from "react-icons/ai";
import pdf_logo from './assets/pdflogo.png'
import { AiOutlineHistory } from "react-icons/ai";
import logo from './assets/logoo.jpeg'

import { Outlet, useNavigate, useParams } from 'react-router-dom';
const Layout = ({toggle,settoggle,uploaded}) => {
    const [Allpdfs,setAllpdfs]=useState([])
    const navigate=useNavigate();
    const {id,filename}=useParams();
    
    useEffect(() => {
        const Fetchpdfs = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/pdfs/`);
                if (!response.data) {
                    throw new Error('Failed to get previous chats');
                }
                setAllpdfs(response.data)
            } catch (error) {
                console.error('Error fetching chats:', error);
              
            }
        };
        Fetchpdfs();
    }, [uploaded,toggle]);
    return (
        <div className='flex w-screen relative h-screen bg-slate-300'>
            {toggle && (
            <div className='w-[300px] flex flex-col gap-[10px] justify-center items-center transition-all duration-700  h-full absolute left-0 bg-slate-900'>
                <div className='w-[90%] text-[30px]  text-white flex justify-end h-[30px]'>
                    
                    <span onClick={() => settoggle((prev) => !prev)} className='flex cursor-pointer justify-center mt-3 items-center'>
                    <AiOutlineCloseSquare />
                    </span>
                </div>
                <h2 className='text-white flex justify-center gap-3 items-center text-[25px] font-bold'>
                <AiOutlineHistory />
                <div>
                HISTORY
                    </div> 
                </h2>
                <div className='text-white w-[90%] gap-3 flex flex-col overflow-scroll mt-2 h-[calc(100%-55px)] '>
                    {Allpdfs.map((item, index) => (
                        <div onClick={()=>navigate(`/${item.filename}/${item.pdf_id}`)} key={item.pdf_id} className={`w-full cursor-pointer px-3 py-4 ${filename===item.filename && id==item.pdf_id?"bg-blue-500":"bg-slate-700"} flex items-center gap-3 h-[40px]`}>
                            <div>
                                {item.pdf_id}
                            </div>
                            <div>
                                {item.filename}
                            </div>
                            <div className=' flex justify-center items-center'>
                                <img className='h-[30px]' src={pdf_logo} alt="" />
                            </div>
                            
                            

                        </div>
                    ))}
                </div>
                <div className='text-white p-3'>
                    <button onClick={() => navigate('/')} className='bg-gray-700 p-3'>NEW CHAT</button>
                </div>
            </div>
            )}
            <div className='w-full h-full'>
                <Outlet settoggle={settoggle}/>
            </div>

        </div>
    )
}

export default Layout