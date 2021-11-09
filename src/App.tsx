import GlobalStyle from './styles/styles';
import OrderBook from './components/OrderBook';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <GlobalStyle/>
      <Header/>
      <OrderBook/>
      <Footer />
    </>
  );
}

export default App;