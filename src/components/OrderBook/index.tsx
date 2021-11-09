import React, { useEffect, FunctionComponent, useRef } from 'react';
import TitleRow from "./TitleRow";
import { Container, TableContainer } from "./styles";
import Spread from "../Spread";
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import { addAsks, addBids, addExistingState, selectAsks, selectBids } from './orderbookSlice';
import { MOBILE_WIDTH } from "../../state/constants";
import Loader from '../Loader';
import DepthVisualizer from '../DepthVisualizer';
import PriceLevelRow from './PriceLevelRow';
import { PriceLevelRowContainer } from "./PriceLevelRow/styles";
import { ProductIds } from '../../App';

const WSS_FEED_URL: string = 'wss://www.cryptofacilities.com/ws/v1';

export enum OrderType {
  BIDS,
  ASKS
}

interface OrderBookProps {
  windowWidth: number;
  productId: string;
  isFeedKilled: boolean;
}

const OrderBook: FunctionComponent<OrderBookProps> = ({ windowWidth, productId, isFeedKilled }) => {
  const bids: number[][] = useAppSelector(selectBids);
  const asks: number[][] = useAppSelector(selectAsks);
  const dispatch = useAppDispatch();
  const ws = useRef({} as WebSocket);

  useEffect(() => {
    const connectWebSocket = () => {
      const unSubscribeMessage = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [ProductIds.XBTUSD === productId ? ProductIds.ETHUSD : ProductIds.XBTUSD]
      };
      const subscribeMessage = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [productId]
      };

      ws.current = new WebSocket(WSS_FEED_URL);

      ws.current.onopen = () => {
        ws.current.send(JSON.stringify(unSubscribeMessage));
        ws.current.send(JSON.stringify(subscribeMessage));
      };
      ws.current.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.numLevels) {
          dispatch(addExistingState(response));
        } else {
          if (response?.bids?.length > 0) {
            dispatch(addBids(response.bids));
          }
          if (response?.asks?.length > 0) {
            dispatch(addAsks(response.asks));
          }
        }
      };
      ws.current.onerror = (event: Event) => {
        console.log('An error occurred:', event);
        setTimeout(() => {
          connectWebSocket();
          console.log(">>> reconnecting in 2 sec")
        }, 2000);
      };
      ws.current.onclose = () => {
        ws.current.close();
      };
    };

    if (isFeedKilled) {
      ws.current.close();
    } else {
      connectWebSocket();
    }

    return () => {
      ws.current.close();
    };
  }, [dispatch, productId, isFeedKilled]);

  const formatNumber = (arg: number): string => {
    return new Intl.NumberFormat('en-US').format(arg);
  };

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", { useGrouping: true, minimumFractionDigits: 2 })
  };

  const buildPriceLevels = (levels: number[][], orderType: OrderType = OrderType.BIDS): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [...levels].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result: number = 0;
        if (orderType === OrderType.BIDS || windowWidth < MOBILE_WIDTH) {
          result = nextLevel[0] - currentLevel[0];
        } else {
          result = currentLevel[0] - nextLevel[0];
        }
        return result;
      }
    );

    return (
      sortedLevelsByPrice.map((level, idx) => {
        const calculatedTotal: number = level[2];
        const total: string = formatNumber(calculatedTotal);
        const depth = level[3];
        const size: string = formatNumber(level[1]);
        const price: string = formatPrice(level[0]);

        return (
          <PriceLevelRowContainer key={idx + depth}>
            <DepthVisualizer key={depth} windowWidth={windowWidth} depth={depth} orderType={orderType}/>
            <PriceLevelRow key={size + total}
                           total={total}
                           size={size}
                           price={price}
                           reversedFieldsOrder={orderType === OrderType.ASKS}
                           windowWidth={windowWidth}/>
          </PriceLevelRowContainer>
        );
      })
    );
  };

  return (
    <Container>
      {bids.length && asks.length ?
        <>
          <TableContainer isBids>
            {windowWidth > MOBILE_WIDTH && <TitleRow windowWidth={windowWidth} reversedFieldsOrder={false}/>}
            {buildPriceLevels(bids, OrderType.BIDS)}
          </TableContainer>
          <Spread/>
          <TableContainer isBids={false}>
            <TitleRow windowWidth={windowWidth} reversedFieldsOrder={true}/>
            {buildPriceLevels(asks, OrderType.ASKS)}
          </TableContainer>
        </> :
        <Loader/>}


    </Container>
  )
};

export default OrderBook;