import React, { useEffect, useState } from 'react';
import GlobalStyle from './styles/styles';
import OrderBook from './components/OrderBook';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(()=> {
    window.onresize = () => {
      setWindowWidth(window.innerWidth);
    }
    setWindowWidth(() => window.innerWidth);
  }, [])


  return (
    <>
      <GlobalStyle/>
      <Header/>
      <OrderBook windowWidth={windowWidth}/>
      <Footer />
    </>
  );
}

export default App;