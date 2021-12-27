import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: grid;
`;

const InfoContainer = styled.div`
  display: grid;
  background-color: #1e1e1e;
  text-align: center;
  border-radius: 0.25rem;
  box-shadow: 0.125rem 0.25rem 0.25rem hsl(0deg 0% 0% / 0.44);
  margin: 0.5rem 1rem;
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
