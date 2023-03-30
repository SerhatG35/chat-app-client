import { Center, Heading, Text } from "@chakra-ui/layout";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { FC, useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

type activeUser = {
  socketID: string;
  userName: string;
};

const ChatBar: FC<Props> = ({ socket }) => {
  const [activeUserData, setActiveUserData] = useState<activeUser[]>([]);

  const listener = (data: activeUser[]) => setActiveUserData(data);

  useEffect(() => {
    socket.on("newUserResponse", listener);

    return () => socket.off("newUserResponse", listener) as any;
  }, [socket]);

  return (
    <Center w="10%" h="100%" justifyContent="flex-start" flexDir="column">
      <Heading size="md">Active Users</Heading>
      <Center flexDir="column">
        {activeUserData.map((data) => (
          <Text key={data.socketID}>{data.userName}</Text>
        ))}
      </Center>
    </Center>
  );
};

export default ChatBar;
