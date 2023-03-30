import { Center } from "@chakra-ui/layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import Chat from "./components/Chat";
import Home from "./components/Home";
const socket = io("http://localhost:4000");

function App() {
  return (
    <BrowserRouter>
      <Center bg="gray.400" w="100%" h="100vh">
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<Chat socket={socket} />}></Route>
        </Routes>
      </Center>
    </BrowserRouter>
  );
}

export default App;
