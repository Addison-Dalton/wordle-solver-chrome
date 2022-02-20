import { FC } from 'react';
import styled from 'styled-components';

import { Letter } from '../letter';

type Props = {
  letters: LetterWithEval[];
}

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 5px;
  margin-bottom: 15px;
`;

export const Word: FC<Props> = ({ letters }) => {
  return (
    <StyledDiv>
    {letters.map(letter => (
      <Letter letter={letter} />
    ))}
  </StyledDiv>
  )
}

