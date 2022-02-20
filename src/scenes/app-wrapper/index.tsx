import styled from 'styled-components';

import { Header } from '../header';
import { Suggestions } from '../suggestions';

const StyledDiv = styled.div`
  font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
  background-color: #565758;
  color: #ffffff;
  position: absolute;
  border: solid 1px #3a3a3c;
  border-radius: 3px;
  top: 10%;
  right: 0;
  margin-right: 12px;
  padding: 16px;
  min-height: 450px;
  height: auto;
  width: 350px;
`;

export const AppWrapper = () => (
  <StyledDiv>
    <Header />
    <Suggestions />
  </StyledDiv>
)