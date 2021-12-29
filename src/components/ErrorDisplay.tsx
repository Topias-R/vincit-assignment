import React from 'react';
import styled from 'styled-components';
import { Surface } from './Surface';

const H2 = styled.h2`
  font-weight: bold;
  color: ${(props) => props.theme.colors.error};
`;

interface ErrorDisplayProps {
  error: unknown;
}

export function ErrorDisplay({ error }: ErrorDisplayProps): JSX.Element | null {
  if (error === null || error === undefined) return null;

  return (
    <Surface>
      <H2>
        {error instanceof Error ? error.message : 'Something went wrong.'}
      </H2>
    </Surface>
  );
}
