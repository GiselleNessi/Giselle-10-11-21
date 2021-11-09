import React, { useState, useEffect } from 'react';
import { PriceLevelRow } from './PriceLevelRow';
import { Container, TableContainer } from './styles';
import { TitleRow } from './TitleRow';

const WSS_FEED_URL: string = 'wss://www.cryptofacilities.com/ws/v1';
const subscribeMessage = {
  event: 'subscribe',
  feed: 'book_ui_1',
  product_ids: ['PI_XBTUSD']
};

interface Delta {
  feed: string;
  product_id: string;
  bids: [];
  asks: [];
}

interface ExistingState {
  numLevels: number;
  feed: string;
  bids: [];
  asks: [];
  product_id: string;
}

const OrderBook = () => {
  const [delta, setDelta] = useState<Delta>();
  const [existingState, setExistingState] = useState<ExistingState>();

  useEffect(() => {
    const ws = new WebSocket(WSS_FEED_URL);

    ws.onopen = () => {
      ws.send(JSON.stringify(subscribeMessage));
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.numLevels) {
        setExistingState(response);
      } else {
        setDelta(response);
      }
    };
    ws.onclose = () => {
      ws.close();
    };

    return () => {
      ws.close();
    };
  }, []);

  const formatNumber = (arg: number): string => {
    return new Intl.NumberFormat('en-US').format(arg);
  };

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", {useGrouping: true, minimumFractionDigits: 2})
  };

  const buildPriceLevels = (levels: []): React.ReactNode => {
    return (
      levels.map((level, index) => {
        const total: string = formatNumber(level[1]);
        const size: string = formatNumber(level[1]);
        const price: string = formatPrice(level[0]);
        return <PriceLevelRow key={index} total={total} size={size} price={price} />;
      })
    );
  };

  return (
    <Container>
      <TableContainer>
        <TitleRow/>
        {existingState && buildPriceLevels(existingState.bids)}
      </TableContainer>
      <TableContainer>
        <TitleRow/>
        {existingState && buildPriceLevels(existingState.asks)}
      </TableContainer>
    </Container>
  )
};

export default OrderBook;