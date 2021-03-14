import styled from 'styled-components';
import { colour, font } from '../../styles/StyleConstants.js';

export const RowContainer = styled.div`
  width: ${props => props.width}vw;
  margin: auto;
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const Row = styled.div`
  text-align: left;
`;

export const FlexContainer = styled.div`
  display: flex;
`;

export const LabelContainer = styled.div`
  text-align: right;
`;
///check here above!

export const StyledTitle = styled.div`
  ${'' /* margin: 0 auto 2rem; */}
`;

export const StyledLabel = styled.label`
  color: ${colour.secondary};
  background: none;
  ${font.label};
  text-transform: uppercase;
  font-size: 0.7rem;
  margin: 0.7rem 1.3rem 0 0;
`;

export const StyledInput = styled.input`
  color: ${colour.primary};
  background: none;
  ${font.regular};
  font-size: 1rem;
  border: none;
  border-bottom: solid 1px ${colour.background2};
  margin-bottom: 1rem;
`;