import React from 'react';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { AuthProvider } from './AuthContext/AuthContext';
import { CartProvider } from './CartProvider/CartProvider';
import ItemListContainer from './components/ItemListContainer/ItemListContainer';
import Login from './components/Login/Login';
import { NavBar } from './components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ItemDetailContainer } from './components/ItemDetailContainer/ItemDetailContainer';
import Register from './components/Register/Register';
import RealTimeProducts from './components/RealTimeProducts/RealTimeProducts';

const App = () => {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path='/' element={<ItemListContainer />} />
              <Route path='/detail/:pid' element={<ItemDetailContainer />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/realtimeproducts' element={<RealTimeProducts />} />
            </Routes>
            <ToastContainer />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </>
  );
};

export default App;
