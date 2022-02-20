import styled from 'styled-components';

const StyledHeader = styled.h2`
  font-weight: 700;
  font-size: 37px;
  text-align: center;
  margin: 0;
  border-bottom: solid 1px #3a3a3c;
`;

export const Header = () => <StyledHeader>{'Wordle Solver'}</StyledHeader>;
