import React, { FunctionComponent } from 'react';
import { MOBILE_WIDTH } from '../../../state/constants';
import { Container } from "./styles";
interface PriceLevelRowProps {
  total: string;
  size: string;
  price: string;
  reversedFieldsOrder: boolean;
  windowWidth: number;
}

const PriceLevelRow: FunctionComponent<PriceLevelRowProps> = ({
                                                                total,
                                                                size,
                                                                price,
                                                                reversedFieldsOrder = false,
                                                                windowWidth
                                                              }) => {
  return (
    <Container isRight={!reversedFieldsOrder} windowWidth={windowWidth}>
      {reversedFieldsOrder || windowWidth < MOBILE_WIDTH ?
        <>
          <span className='price'>{price}</span>
          <span>{size}</span>
          <span>{total}</span>
        </> :
        <>
          <span>{total}</span>
          <span>{size}</span>
          <span className='price'>{price}</span>
        </>}
    </Container>
  );
};

export default PriceLevelRow;