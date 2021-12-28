import React from 'react';
import styled, { keyframes } from 'styled-components';

const Container = styled.div`
  display: grid;
`;

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

const InfoContainer = styled.div`
  display: grid;
  background-color: #1e1e1e;
  text-align: center;
  border-radius: 0.25rem;
  box-shadow: 0.125rem 0.25rem 0.25rem hsl(0deg 0% 0% / 0.44);
  margin: 0.5rem 1rem;
  animation-name: ${animation};
  animation-duration: 300ms;
`;

const H2 = styled.h2`
  margin-bottom: 0rem;
  font-size: 1.2em;
`;

const Paragraph = styled.p``;

interface InfoDisplayProps {
  info: {
    title: string | JSX.Element;
    body: string | JSX.Element;
  }[];
}

export function InfoDisplay({ info }: InfoDisplayProps): JSX.Element {
  return (
    <Container>
      {info.map(({ title, body }, idx) => (
        <InfoContainer key={idx}>
          <H2>{title}</H2>
          <Paragraph>{body}</Paragraph>
        </InfoContainer>
      ))}
    </Container>
  );
}
