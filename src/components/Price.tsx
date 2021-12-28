import React from 'react';
import styled from 'styled-components';

const Span = styled.span`
  font-weight: bold;
  color: #85bb65;
`;

interface PriceProps {
  value: number;
  currency: string;
}

export function Price({ value, currency }: PriceProps): JSX.Element {
  return (
    <Span>
      {value.toLocaleString(undefined, { style: 'currency', currency })}
    </Span>
  );
}
