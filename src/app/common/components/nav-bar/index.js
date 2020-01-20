import React from "react";
import styled from "styled-components";
import { IconStandard } from "../../ui";

const COLORS = {
  navy: "#273147",
  steel: "#466fb0",
  slate: "#325490",
  black: "#000"
};

const UI = {
  size: "32px"
};

const MenuButton = styled.button`
  position: relative;
  top: 8px;
  left: 8px;
  border: none;
  height: 32px;
  width: 32px;
  color: ${COLORS.steel};
  border: 1px solid ${COLORS.steel};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ease-in-out 0.3s;
  cursor: pointer;
  &:hover {
    background: none;
    border: 1px solid ${COLORS.navy};
    color: ${COLORS.navy};
  }
  &:focus {
    outline: none;
  }
`;

const MenuContainer = styled.div`
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  height: 48px;
  box-sizing: border-box;
`;

export const Navbar = ({ onPress }) => (
  <MenuContainer>
    <MenuButton onClick={onPress}>
      <IconStandard name="menu" />
    </MenuButton>
  </MenuContainer>
);
