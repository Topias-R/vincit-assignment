import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Surface } from './Surface';

const animation = keyframes`
  0% {
    transform: scale(0) rotate(3deg);
  }
  60% {
    transform: scale(0.8) rotate(-3deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

const Container = styled(Surface)`
  text-align: center;
  padding: 0rem 1rem;
  margin: 0.5rem 1rem;
  animation-name: ${animation};
  animation-duration: 300ms;
`;

const H2 = styled.h2`
  margin-bottom: 0rem;
  font-size: 1.2em;
`;

const Paragraph = styled.p``;

type NonNullableArray<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

interface InfoProps<T> {
  title: string;
  values: T;
  render: (values: NonNullableArray<T>) => JSX.Element | string;
  fallback: JSX.Element | string;
}

function arrayIsNonNullable<T extends unknown[]>(
  array: T
): array is NonNullableArray<T> {
  return (
    array.length ===
    array.filter((val) => val !== null && val !== undefined).length
  );
}

export function Info<T extends unknown[]>({
  title,
  values,
  render,
  fallback
}: InfoProps<T>): JSX.Element {
  return (
    <Container>
      <H2>{title}</H2>
      <Paragraph>
        {arrayIsNonNullable(values) ? render(values) : fallback}
      </Paragraph>
    </Container>
  );
}
