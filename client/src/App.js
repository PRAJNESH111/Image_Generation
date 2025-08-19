// import logo from './logo.svg';
// import './App.css';
import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./Utils/Theme";
import Home from "./Pages/Home";
import CreatePost from "./Pages/CreatePost";
import {BrowserRouter , Routes, Route} from 'react-router-dom'
import Navbar from "./Components/Navbar";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  position: relative;
  transition: all 0.3s ease;
`;


  const Wrapper = styled.div`
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  jsutify-content: space-between;
  flex: 3;
  `


function App() {
  return (
   
    <ThemeProvider theme={darkTheme}>
      <Container>
        <Wrapper>
        <BrowserRouter>
          <Navbar />
          
            <Routes>
              <Route path="/" element={<Home />} exact/>
              <Route path="/post" element={<CreatePost />}  exact/>
            </Routes>
          </BrowserRouter> 
                  
        </Wrapper>
      </Container>
    </ThemeProvider>
  );
}

export default App;
