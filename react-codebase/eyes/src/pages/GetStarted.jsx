import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const GetStartedContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-weight: 700;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #4a5568;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const Button = styled(Link)`
  display: inline-block;
  background: #4f46e5;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 9999px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  margin: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: #4338ca;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonSecondary = styled(Button)`
  background: white;
  color: #4f46e5;
  border: 2px solid #4f46e5;
  
  &:hover {
    background: #f8f9fa;
    color: #4338ca;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const GetStarted = () => {
  return (
    <GetStartedContainer>
      <Content>
        <Title>Ready to Get Started?</Title>
        <Subtitle>
          Join our community and start your journey with us today. Create an account or sign in to access all features.
        </Subtitle>
        <ButtonGroup>
          <Button to="/login">Sign In</Button>
          <ButtonSecondary to="/register">Create Account</ButtonSecondary>
        </ButtonGroup>
      </Content>
    </GetStartedContainer>
  );
};

export default GetStarted;
