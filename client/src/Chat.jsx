import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { AiOutlineSend } from "react-icons/ai";
import { AiOutlineFileAdd } from "react-icons/ai";
import TypingAnimation from './TypingAnimation';
import ai_image from './assets/download.jpg'
import user_image from './assets/icon-256x256.png'
import pdf_logo from './assets/pdflogo.png'
import logo from './assets/logoo.jpeg'

function Chat({ settoggle }) {
  const { filename, id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`https://generativeai-1.onrender.com/chat/${id}`);
        if (!response.data) {

          throw new Error('Failed to get previous chats');
        }
        const chats = response.data;
        const newQuestions = chats.map(chat => chat.question);
        const newAnswers = chats.map(chat => chat.answer);
        setQuestions(newQuestions);
        setAnswers(newAnswers);
        setError('');
      } catch (error) {
        console.error('Error fetching chats:', error);
        setError('An error occurred while fetching chats');
      }
    };

    fetchChats();
  }, [id]);
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!currentQuestion.trim()) {
      setError('Please enter a question');
      return;
    }
    setQuestions([...questions, currentQuestion]);
    setCurrentQuestion('');
    setIsTyping(true);

    try {
      const response = await axios.post('https://generativeai-1.onrender.com/query/', { user_question: currentQuestion, pdf_id: id });

      if (!response.data || !response.data.answer) {
        throw new Error('Failed to get answer');
      }

      setTimeout(() => {
        setAnswers([...answers, response.data.answer]);
        setIsTyping(false); 
      }, 1500);
      setError('');
    } catch (error) {
      console.error('Error getting answer:', error);
      setError('An error occurred while getting the answer');
      setIsTyping(false); 

    }
  };

  return (
    <div className='bg-slate-200 w-screen h-screen overflow-hidden'>
      <div className='w-full h-[60px] flex justify-between px-5 py-2 items-center bg-white shadow-md '>
        <div className='flex w-[50%] justify-between gap-2'>
          <div onClick={() => settoggle((prev) => !prev)} className='flex cursor-pointer border-2 px-2  justify-center items-center text-[25px]'>
            <AiOutlineFileAdd />
          </div>
          <div className='flex justify-center items-center text-[20px]'>
            <img className='h-[60px]' src={logo} alt="" />
          </div>

        </div>

        <div className='flex w-[50%] justify-end gap-2'>
          <div>
            <img className='h-[25px]' src={pdf_logo} alt="" />
          </div>
          <div>
            {filename+"_"+id}
          </div>
          
        </div>
      </div>
      <div className='h-[83%] w-full overflow-scroll'>
        <div className='px-4 pt-5'>
          {questions.length===0 && (
            <div className='w-full h-full flex text-[20px] font-bold justify-center items-center'>
              Let's dive into the world of discovery together! Begin your quest by asking questions !
            </div>
          )}
          {questions.map((question, index) => (
            <div key={index}>
              <div className='flex mt-3 w-full gap-6  items-center'>
                <div className='w-[50px] h-[50px] rounded-full'>
                  <img src={user_image} className='rounded-full w-full h-full object-cover ' alt="" />

                </div>

                <div className='flex w-[calc(100%-50px)] justify-start items-center'>
                  {question}
                </div>
              </div>
              {answers[index] && (
                <div className='flex mt-3 w-full gap-6  items-center'>
                  <div className='w-[50px] h-[50px] rounded-full'>
                    <img src={ai_image} className='rounded-full w-full h-full object-cover ' alt="" />

                  </div>
                  <div className='flex justify-start w-[calc(100%-50px)] items-center'>
                    {answers[index]}
                  </div>

                </div>
              )}



            </div>
          ))}
          {isTyping && (
            <div className='flex mt-3 w-full gap-6  items-center'>
              <div className='w-[50px] h-[50px] rounded-full'>
                <img src={ai_image} className='rounded-full w-full h-full object-cover ' alt="" />

              </div>

              <div className='flex w-[calc(100%-50px)] justify-start items-center'>
                <TypingAnimation />
              </div>

            </div>
          )}
        </div>
      </div>
      <div className='w-full px-5 mt-2'>
        <form className='flex gap-1' onSubmit={handleQuestionSubmit}>
          <input className='w-[95%] p-1 h-[40px] rounded-lg' placeholder='Send a Message' type="text" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} />
          <button className=' border-[1px] hover:scale-110 border-black bg-slate-300 px-3 p-1 rounded-md' type="submit">
            <AiOutlineSend />
          </button>
        </form>

      </div>
    </div>
  );
}

export default Chat;
