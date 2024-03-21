import React,{ useEffect, useState } from 'react';
import './App.css';
import LogIn from './components/LogIn.tsx';
import { Route, Routes } from 'react-router-dom';
import Main from './components/Main.tsx';
import './index.css'
import Messaging from './components/Messaging.tsx';
import CreateAccount from './components/CreateAccount.tsx';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice.js';
import LargeMain from './components/LargeMain.tsx';

function App() {

  const user = useSelector(selectUser);

  const [screenSize, setScreenSize] = useState(window.innerWidth < 900);
  
  const updateView = () => {
    setScreenSize(window.innerWidth < 900);
  }

  useEffect(() => {
    window.addEventListener('resize', updateView);
    return () => window.removeEventListener('resize', updateView);
  });

  let largeScreenLogIn = <Main />;

  if (!screenSize) {
    largeScreenLogIn = <LargeMain />;
  }
  
  return (
    <Routes>
      <Route path='/example' element={!user ? <LogIn example={true} /> : largeScreenLogIn} />
      <Route path='/' element={!user ? <LogIn /> : largeScreenLogIn} />
      <Route path='/create' element={!user ? <CreateAccount /> : largeScreenLogIn} />
      <Route path='main' element={largeScreenLogIn} />
      <Route path='/messaging/:id' element={<Messaging />} />
    </Routes>
  );
}

export default App;
