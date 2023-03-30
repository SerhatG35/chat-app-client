import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Center } from "@chakra-ui/layout";
import { joiResolver } from "@hookform/resolvers/joi";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import dayjs from "dayjs";
import Joi from "joi";
import { FC, useEffect, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Socket } from "socket.io-client";

type FormTypes = {
  message: string;
};

type Props = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const ChatFooter: FC<Props> = ({ socket }) => {
  const { control, watch, handleSubmit, resetField } = useForm<FormTypes>({
    defaultValues: {
      message: "",
    },
    resolver: joiResolver(
      Joi.object({ message: Joi.string().required().trim() })
    ),
  });

  const messageValue = watch("message");

  const handleIsTyping = useCallback(() => {
    if (messageValue.length > 0) {
      return socket.emit(
        "typing",
        `${localStorage.getItem("userName")} is typing`
      );
    } else {
      return socket.emit("typing", undefined);
    }
  }, [messageValue.length, socket]);

  useEffect(() => {
    handleIsTyping();
  }, [handleIsTyping]);

  const onSubmit: SubmitHandler<FormTypes> = ({ message }) => {
    if (localStorage.getItem("userName")) {
      localStorage.setItem("socketid", socket.id);
      socket.emit("message", {
        text: message,
        chatColor:localStorage.getItem("chatColor"),
        name: localStorage.getItem("userName"),
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id,
        timestamp: `${dayjs().hour()}:${dayjs().format("mm")}`,
      });
      resetField("message");
    }
  };

  const messagePresent = !!watch("message");

  return (
    <Center as="form" h="20%" w="100%" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="message"
        render={({ field }) => (
          <Input {...field} placeholder="Type your message.." resize="none" />
        )}
      />
      <Button isDisabled={!messagePresent} type="submit" ml="2rem">
        Send
      </Button>
    </Center>
  );
};

export default ChatFooter;
