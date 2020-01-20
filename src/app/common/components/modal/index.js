import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 80%;
  height: 400px;
  background: white;
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  top: 40px;
  z-index: 10;
  display: ${props => (props.isActive ? 'block' : 'none')};
`;

const Backdrop = styled.div`
  z-index: 1;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  display: ${props => (props.isActive ? 'block' : 'none')};
`;

const ToggleButton = styled.button`
  background: red;
  color: white;
`;

const Modal = ({ children }) => {
  const [isActive, setActive] = React.useState(false);
  const handleActive = () => {
    setActive(!isActive);
  };

  return (
    <>
      <ToggleButton onClick={() => setActive(!isActive)}>
        ToggleButton
      </ToggleButton>
      <Container isActive={isActive}>
        <h1>Modal</h1>
        {children}
      </Container>
      <Backdrop onClick={handleActive} isActive={isActive} />
    </>
  );
};

export default Modal;
