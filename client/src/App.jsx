import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter} from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';
import Layout from './Layout';

function App() {
  const [filename, setfilename] = useState('')
  const [id, setid] = useState('')
  const [toggle,settoggle]=useState(false);
  const [uploaded,setuploaded]=useState(1)
  function callback(name, pdf_id) {
    setfilename(name)
    setid(pdf_id)
  }
  
  
  return (
    <BrowserRouter>
        
        <Routes >
          <Route element={<Layout toggle={toggle} settoggle={settoggle} uploaded={uploaded}/>}>

         
            <Route path='/' element={< Home toggle={toggle} settoggle={settoggle} setuploaded={setuploaded} />} />
            <Route path='/:filename/:id' element={<Chat toggle={toggle} settoggle={settoggle}   />} />
          </Route>
        </Routes>
        
        


    </BrowserRouter>
  );
}

export default App;
