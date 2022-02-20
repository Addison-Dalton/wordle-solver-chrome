import styled from 'styled-components';

import { Word } from '../../components/word';
import { useSuggestedWords } from './hooks';

const StyledParagraph = styled.p`
  
`;

const StyledUl = styled.ul`
  list-style-type: none;
  padding-inline-start: 0;
`;

const StyledLi = styled.li``;

export const Suggestions = () => {
  const suggestedWords = useSuggestedWords();
  const intructionText = suggestedWords.length > 0 ? 'Your suggested words are below!' : 'Make your first guess to receive some suggestions!';
  return (
    <div>
      <StyledParagraph>{intructionText}</StyledParagraph>
      <StyledUl>
        {suggestedWords.map((suggestedWord) => {
          return (
            <StyledLi>
              <Word letters={suggestedWord} />
            </StyledLi>
          )
        })}
      </StyledUl>
    </div>
  )
}