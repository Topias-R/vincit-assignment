import React, { ReactNode } from 'react';
import styled from 'styled-components';
import {
  useViewPortDimensions,
  ViewPortDimensions
} from '../hooks/useViewPortDimensions';

interface ContainerProps {
  readonly dimensions: ViewPortDimensions;
}

const Container = styled.div<ContainerProps>`
  height: ${({ dimensions }) =>
    dimensions.height ? dimensions.height + 'px' : '100vh'};
  width: ${({ dimensions }) =>
    dimensions.width ? dimensions.width + 'px' : '100vw'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

interface ViewPortContainerProps {
  children?: ReactNode;
}

export function ViewPortContainer({
  children
}: ViewPortContainerProps): JSX.Element {
  const dimensions = useViewPortDimensions();

  return <Container dimensions={dimensions}>{children}</Container>;
}
