import { Button } from "@chakra-ui/button";
import { Center, Heading, Text } from "@chakra-ui/layout";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Socket } from "socket.io-client";
import ChatBar from "./ChatBar";
import ChatBody from "./ChatBody";
import ChatFooter from "./ChatFooter";

type Props = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

export type MessageTypes = {
  id: string;
  name: string;
  socketID: string;
  text: string;
  timestamp: string;
  chatColor: string;
};

const Chat: FC<Props> = ({ socket }) => {
  const [messages, setMessages] = useState<MessageTypes[]>([]);
  const navigate = useNavigate();
  const lastMessageRef = useRef<null | HTMLDivElement>(null);

  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("chatColor");
    navigate("/");
  };

  const listener = (data: MessageTypes) =>
    setMessages((state) => [...state, data]);

  useEffect(() => {
    socket.on("messageResponse", listener);
    return () => socket.off("messageResponse", listener) as any;
  }, [socket]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <Center w="100%" h="100%" p="6" flexDir="column">
      <Center w="100%" h="5%" mb="2rem" justifyContent="space-between">
        <Heading>Chat App</Heading>
        <Center>
          <Text>{localStorage.getItem("userName")}</Text>
          <Button ml="1rem" colorScheme="red" onClick={handleLeaveChat}>
            Leave
          </Button>
        </Center>
      </Center>
      <Center w="100%" h="95%">
        <Center w="90%" h="100%" flexDir="column">
          <ChatBody
            socket={socket}
            messages={messages}
            lastMessageRef={lastMessageRef}
          />
          <ChatFooter socket={socket} />
        </Center>
        <ChatBar socket={socket} />
      </Center>
    </Center>
  );
};

export default Chat;
