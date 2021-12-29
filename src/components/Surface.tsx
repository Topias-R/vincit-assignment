import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
  background-color: ${(props) => props.theme.colors.background.main};
  border-radius: ${(props) => props.theme.geometry.borderRadius};
  box-shadow: 0.125rem 0.25rem 0.25rem hsl(0deg 0% 0% / 0.44);
`;

interface SurfaceProps {
  className?: string;
  children?: ReactNode;
}

export function Surface({ className, children }: SurfaceProps): JSX.Element {
  return <Container className={className}>{children}</Container>;
}
