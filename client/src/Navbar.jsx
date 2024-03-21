import React from 'react'

const Navbar = () => {
    return (
        <div>
            {/* {toggle && ( */}
            <div className='w-[300px] flex flex-col gap-[10px] justify-center items-center transition-all duration-700  h-full absolute left-0 bg-slate-900'>
                <div className='w-[90%] text-[30px]  text-white flex justify-end h-[30px]'>
                    <span onClick={() => settoggle((prev) => !prev)} className='flex justify-center items-center'>
                        X
                    </span>
                </div>
                <div className='text-white w-[90%] h-[calc(100%-50px)] '>
                    {Allpdfs.map((item, index) => (
                        <div className='w-full flex items-center gap-3 h-[35px]'>
                            <div>
                                {item.pdf_id}
                            </div>
                            <div>
                                {item.filename}
                            </div>

                        </div>
                    ))}
                </div>
                <div className='text-white p-3'>
                    <button onClick={() => navigate} className='bg-gray-700 p-3'>NEW CHAT</button>
                </div>
            </div>
            {/* )} */}
        </div>
    )
}

export default Navbar