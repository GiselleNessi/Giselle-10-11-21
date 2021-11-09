import GlobalStyle from './styles/styles';
import OrderBook from './components/OrderBook';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <GlobalStyle/>
      <Header/>
      <OrderBook/>
    </>
  );
}

export default App;