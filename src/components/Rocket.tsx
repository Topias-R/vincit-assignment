import React from 'react';
import styled, { keyframes } from 'styled-components';

const animation = keyframes`
  0% {
    transform: rotate(-45deg) translateX(-100vw);
    opacity: 0;
  }
  1% {
    opacity: 1;
  }
  99% {
    opacity: 1;
  }
  100% {
    transform: rotate(-45deg) translateX(100vw) scaleX(1.1);
    opacity: 0;
  }
`;

interface RocketContainerProps {
  readonly top: number;
  readonly delay: number;
}

const RocketContainer = styled.div<RocketContainerProps>`
  position: absolute;
  width: 0.25rem;
  height: 0.25rem;
  top: ${({ top }) => `${top}vh`};
  left: 50%;
  z-index: -1;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 0.25rem rgba(236, 94, 11, 0.1),
    0 0 0 0.5rem rgba(236, 94, 11, 0.1), 0 0 1.25rem rgba(236, 94, 11, 1);
  animation-name: ${animation};
  animation-duration: 10s;
  animation-timing-function: cubic-bezier(0.63, 0.41, 0.69, 0.42);
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  animation-delay: ${({ delay }) => `${delay}s`};

  &::before {
    content: '';
    position: absolute;
    width: 1.875rem;
    top: 0.3125rem;
    height: 0.3125rem;
    background: linear-gradient(-90deg, rgb(236, 94, 11), transparent);
    transform: translate(-100%, -100%);
  }
`;

const Emoji = styled.div`
  position: absolute;
  cursor: default;
  user-select: none;
  top: 0.4375rem;
  transform: rotate(45deg) translate(-50%, -50%);
`;

export function Rocket(): JSX.Element {
  return (
    <RocketContainer
      top={Math.floor(Math.random() * 301 - 100)}
      delay={Math.random() * 20 - 10}
    >
      <Emoji>🚀</Emoji>
    </RocketContainer>
  );
}
