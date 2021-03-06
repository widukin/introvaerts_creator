import styled from 'styled-components';
import { colour } from '../../shared/styles/StyleConstants';
import { NavLink } from 'react-router-dom';

export const MenuContainer = styled.div`
  width: 97.5%;
  height: 18vh;
  display: flex;
  justify-content: space-between;
  ${'' /* margin-bottom: 12vh; */}
  background: ${colour.background1};
  position: fixed;
  padding-top: 1rem;
  top: 0rem;
  left: 1rem;
  z-index: 20;
`;

export const MenuBox = styled.div`
  display: flex;
`;

export const LinkBox = styled.div`
  border-left: solid 1px ${colour.background2};
  padding-left: 1rem;
  padding-top: 3.7rem;
  margin-left: 7vw;
  min-height: 3rem;
  min-width: 6rem;
  background: ${colour.background1};
`;
export const MenuItem = styled.div`
  position: relative;
`;

export const StyledLink = styled(NavLink)`
  &.active {
    color: ${colour.accent};
  }
`;

export const Dropdown = styled.div`
  border-left: solid 1px ${colour.background2};
  padding-left: 1rem;
  margin-left: 7vw;
  position: absolute;
  top: 4.5rem;
  background: ${colour.background1};
  z-index: 20;
  width: 11.5rem;
`;

export const SignOutBlock = styled.div`
      
}
`;

export const LoggedInUser = styled.p`
  margin-top: 30%;
  text-align: center;
`;

export const Offset = styled.div`
  padding-top: 25vh;
`;

export const Visit = styled.a`
  font-size: 0.8rem;
  border-bottom: solid 1px ${colour.accent};
`;
