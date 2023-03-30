import { Button, Center, Input } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { FC } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useNavigate } from "react-router-dom";

type Props = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

type FormTypes = {
  userName: string;
};

const Home: FC<Props> = ({ socket }) => {
  const navigate = useNavigate();
  const { control, handleSubmit } = useForm<FormTypes>({
    defaultValues: {
      userName: "",
    },
    resolver: joiResolver(
      Joi.object({ userName: Joi.string().required().min(3).max(20) })
    ),
  });

  const onSubmit: SubmitHandler<FormTypes> = ({ userName }) => {
    localStorage.setItem("userName", userName);
    localStorage.setItem(
      "chatColor",
      `#${Math.floor(Math.random() * 16777215).toString(16)}`
    );
    socket.emit("newUser", {
      userName,
      socketID: socket.id,
    });
    navigate("/chat");
  };

  return (
    <Center
      w="30%"
      h="30%"
      bg="whiteAlpha.500"
      rounded="8px"
      boxShadow="lg"
      p="4"
      as="form"
      action="login"
      flexDir="column"
      justifyContent="space-evenly"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        control={control}
        name="userName"
        render={({ field }) => (
          <Input {...field} placeholder="Username" type="text" maxLength={20} />
        )}
      />
      <Button type="submit">Login</Button>
    </Center>
  );
};

export default Home;
