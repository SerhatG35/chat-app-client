import { Center, Text } from "@chakra-ui/layout";
import { FC, useEffect, useState } from "react";
import { MessageTypes } from "..";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

type Props = {
  messages?: MessageTypes[];
  lastMessageRef: React.MutableRefObject<HTMLDivElement | null>;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const ChatBody: FC<Props> = ({ messages, lastMessageRef, socket }) => {
  const [typingStatus, setTypingStatus] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    socket.on("typingResponse", (data) => setTypingStatus(data));
  }, [socket]);

  return (
    <Center
      rounded="4px"
      w="100%"
      h="80%"
      bg="whiteAlpha.700"
      flexDir="column"
      position="relative"
      boxShadow="lg"
      justifyContent="flex-end"
    >
      {typingStatus ? (
        <Text
          fontSize="12px"
          opacity={0.7}
          position="absolute"
          bottom="1px"
          left="1px"
        >
          {typingStatus}
        </Text>
      ) : null}
      <Center flexDir="column" p="2rem" w="100%" overflowY="auto">
        {messages?.map((message) => {
          const isUser = message.socketID === localStorage.getItem("socketid");

          return (
            <Center
              key={message.id}
              maxW="50%"
              h="100%"
              alignSelf={isUser ? "flex-end" : "flex-start"}
              alignItems="flex-end"
              mt="0.25rem"
              flexDir="column"
            >
              <Center
                bg={message.chatColor}
                px="2"
                pb="3"
                pt="2"
                rounded="4px"
                position="relative"
              >
                {isUser ? null : <Text mr="0.25rem">{message.name}:</Text>}
                <Text
                  alignSelf="center"
                  position="absolute"
                  bottom="1px"
                  left={isUser ? "2px" : undefined}
                  right={isUser ? undefined : "2px"}
                  fontSize="10px"
                  opacity={0.7}
                >
                  {message.timestamp}
                </Text>
                <Text>{message.text}</Text>
              </Center>
            </Center>
          );
        })}
        <div ref={lastMessageRef} />
      </Center>
    </Center>
  );
};

export default ChatBody;
