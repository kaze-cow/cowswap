import { ReactNode } from 'react'

import styled, { keyframes } from 'styled-components/macro'

const VIEWBOX_SIZE = 44
const EYE_RADIUS = 2.4

export interface DungLoadingIconProps {
  size?: number
  className?: string
}

/**
 * dung.fun loading icon: a golden dung pile with jumping eyes.
 * Replaces CowLoadingIcon (libs/ui) in dungfun builds; the brand is dark-only,
 * so the palette is fixed and matches dungTheme.ts (paperDarkerCustom / primary).
 */
export function DungLoadingIcon({ size = 36, className }: DungLoadingIconProps = {}): ReactNode {
  return (
    <styledEl.Svg
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      focusable="false"
      aria-hidden="true"
      className={className}
      $size={size}
    >
      <styledEl.Background />
      <styledEl.Pile>
        <ellipse cx="22" cy="29" rx="13" ry="6" />
        <ellipse cx="22" cy="23.5" rx="10" ry="5.5" />
        <ellipse cx="22" cy="18.5" rx="7" ry="4.8" />
        <path d="M22 13.8c0-2.8 2.4-3.8 4.4-3s2.3 2.6 1.2 4" />
      </styledEl.Pile>
      <styledEl.Eye cx={17.5} cy={23} r={EYE_RADIUS} $delay={0} />
      <styledEl.Eye cx={26.5} cy={23} r={EYE_RADIUS} $delay={160} />
    </styledEl.Svg>
  )
}

const eyeJump = keyframes`
  0%, 10% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-0.9px);
  }
  30% {
    transform: translateY(-1.9px);
  }
  38% {
    transform: translateY(-2.5px);
  }
  44% {
    transform: translateY(-2.7px);
  }
  52% {
    transform: translateY(-1.7px);
  }
  60% {
    transform: translateY(-0.8px);
  }
  68% {
    transform: translateY(0.35px);
  }
  76% {
    transform: translateY(-0.2px);
  }
  86% {
    transform: translateY(0.1px);
  }
  94%, 100% {
    transform: translateY(0);
  }
`

const styledEl = {
  Svg: styled.svg<{ $size: number }>`
    width: ${({ $size }) => `${$size}px`};
    height: ${({ $size }) => `${$size}px`};
    display: block;
  `,

  Background: styled.rect.attrs({ x: 0, y: 0, width: VIEWBOX_SIZE, height: VIEWBOX_SIZE, rx: 12 })`
    fill: #1a1109;
  `,

  Pile: styled.g`
    fill: #e3a83c;

    path {
      fill: none;
      stroke: #e3a83c;
      stroke-width: 3;
      stroke-linecap: round;
    }
  `,

  Eye: styled.circle<{ $delay?: number }>`
    fill: #1a1109;
    animation-name: ${eyeJump};
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-delay: ${({ $delay }) => `${$delay ?? 0}ms`};
    animation-timing-function: cubic-bezier(0.25, 0.15, 0.25, 1);
    transform-origin: center;
    transform-box: fill-box;
    will-change: transform;

    @media (prefers-reduced-motion: reduce) {
      animation: none;
    }
  `,
}
