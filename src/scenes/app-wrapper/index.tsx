import styled from 'styled-components';

import { Header } from '../header';
import { Suggestions } from '../suggestions';

const StyledDiv = styled.div`
  height: 600px;
  width: 400px;
`;

export const AppWrapper = () => (
  <StyledDiv>
    <Header />
    <Suggestions />
  </StyledDiv>
)