import { FC } from 'react';
import styled from 'styled-components';

type Props = {
  letter: LetterWithEval;
}

const StyledDiv = styled.div`
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  line-height: 4rem;
  font-weight: bold;
  vertical-align: middle;
  text-transform: uppercase;
  background-color: #818384;

  &.present {
    background-color: #b59f3b;
  }

  &.correct {
    background-color: #538d4e;
  }

  &.unknown{
    background-color: #818384;
  }
`;


export const Letter: FC<Props> = ({ letter }) => (
  <StyledDiv className={letter.evaluation}>
    {letter.letter}
  </StyledDiv>
)