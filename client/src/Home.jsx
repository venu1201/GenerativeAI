import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineFileAdd } from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import img_file from './assets/file-upload.svg'
import pdf_logo from './assets/pdflogo.png'
import logo from './assets/logoo.jpeg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingSpinner from './Spinner'
function Home({ settoggle, setuploaded }) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [loading,setloading]=useState(false);
    const navigate = useNavigate();
   

    const handleSubmit = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }
        setloading(true);
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await axios.post('https://generativeai-1.onrender.com/upload-pdf', formData);
            settoggle(false)
            setloading(false);
            console.log("falseed")
            setuploaded((prev) => prev + 1)
            navigate(`/${response.data.filename}/${response.data.pdf_id}`)
            if (!response.data || !response.data.content) {
                throw new Error('Failed to upload file');
            }

            setError('');
        } catch (error) {
            setloading(false);
            toast.error('Error uploading file', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: 0,
                theme: "colored",
            });
            console.error('Error uploading file:', error);
            setError('An error occurred while uploading the file');
        }
    };
    const handleDrop = async (acceptedFiles) => {
        const pdfFile = acceptedFiles[0];
        if (pdfFile) {
            if (pdfFile.type !== 'application/pdf') {
                toast.error('Please drop a PDF file', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: 0,
                    theme: "colored",
                });
            } else {
                setFile(pdfFile);
            }
        }
    };
    
    const handleCancel= ()=>{
        setFile(null)
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: '.pdf',
        // multiple: true, // Enable selection of multiple images
    });

    return (
        <div className='bg-slate-200 w-screen h-screen overflow-hidden'>
        <ToastContainer
                position="top-right"
                autoClose={4000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
            <div className='w-full h-[60px] flex justify-between px-5 py-2 items-center bg-white shadow-md '>
                <div className='flex w-[50%] justify-between gap-2'>
                    <div onClick={() => settoggle((prev) => !prev)} className='flex cursor-pointer justify-center border-2 px-2  items-center text-[25px]'>
                        <AiOutlineFileAdd />
                    </div>
                    <div className='flex justify-center items-center text-[20px]'>
                        <img className='h-[60px]' src={logo} alt="" />

                    </div>

                </div>
            </div>
            <div className='h-[83%]  w-full overflow-scroll'>
                {file === null ? (
                    <div className='flex flex-col justify-center items-center mt-10'>
                        <div
                            {...getRootProps()}
                            className={`p-4 medium:px-20 bg-white px-5 cursor-pointer w-[95%] h-[400px] shadow-lg flex justify-center items-center}`}
                        >
                            <input {...getInputProps()} />

                            <div className="text-black w-full  flex justify-center flex-col">

                                <div className='w-full h-full flex justify-center flex-col'>
                                    <div className='w-full flex justify-center'>
                                        <img className='w-[100px] h-[90px]' src={img_file} alt="" />

                                    </div>
                                    <h3 className="text-[25px] flex justify-center  text-slate-900">
                                        Drag PDF here
                                    </h3>
                                    <p className="text-black w-full mt-2 flex justify-center text-[20px]">PDF</p>
                                    <div className='w-full flex justify-center mt-4'>
                                        <button type="button" className=" bg-slate-800 text-white p-3 rounded-md w-[200px]">
                                            Select from computer
                                        </button>
                                    </div>
                                </div>

                            </div>




                        </div>
                    </div>) : (
                    <div className='flex flex-col justify-center items-center mt-10'>
                        <div

                            className={`p-4 medium:px-20 bg-white px-5 cursor-pointer w-[95%] h-[400px] shadow-lg flex justify-center items-center}`}
                        >


                            <div className="text-black w-full  flex justify-center flex-col">

                                <div className='w-full h-full flex justify-center flex-col'>
                                    <div className='w-full flex justify-center'>
                                        <img className='w-[160px] h-[170px]' src={pdf_logo} alt="" />

                                    </div>
                                    <h3 className="text-[25px] flex justify-center  text-slate-900">
                                        {file?.name}
                                    </h3>
                                    <div className='w-full flex gap-3 justify-center mt-4'>
                                        {loading ===true? (
                                            <button type="button" className=" bg-slate-800 text-white p-3 rounded-md flex justify-center items-center w-[100px]">
                                                <LoadingSpinner/>
                                            </button>
                                        ):(
                                            <button onClick={() => handleSubmit()} type="button" className=" bg-slate-800 text-white p-3 rounded-md w-[100px]">
                                            Upload
                                        </button>
                                        )}
                                        
                                        <button onClick={() => handleCancel()} type='button' className=" bg-red-500 text-white p-3 rounded-md w-[100px]">
                                            Cancel
                                        </button>
                                        
                                    </div>

                                </div>

                            </div>



                        </div>

                    </div>
                )}
            </div>

        </div>
    );
}

export default Home;
