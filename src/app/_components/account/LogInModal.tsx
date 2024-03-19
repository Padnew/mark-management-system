import React, { useContext, useState } from "react";
import {
  Button,
  Group,
  TextInput,
  Stack,
  PasswordInput,
  Text,
  Title,
} from "@mantine/core";
import UserContext from "@/app/context/UserContext";

const LogInModal: React.FC = () => {
  const userContext = useContext(UserContext);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");

  const handleSubmit = async () => {
    if (userContext) {
      const success = await userContext.login(username, password);
      if (!success) {
        setLoginError("Login failed. Please check your email and password.");
      } else {
        setLoginError("");
        setUsername("");
        setPassword("");
      }
    }
  };

  return (
    <>
      {userContext?.user ? (
        <Group justify="center" data-cy="logged-in-modal">
          <Title order={3} ta="center">
            Currently logged in as {userContext.user.first_name}{" "}
            {userContext.user.last_name}
          </Title>
          <Button size="lg" onClick={userContext.logout}>
            Log me out
          </Button>
        </Group>
      ) : (
        <Stack data-cy="logged-out-modal">
          <TextInput
            label="Email"
            placeholder="lecturer@uni.ac.uk"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-cy="login-username-field"
          />
          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-cy="login-password-field"
          />
          {loginError && <Text c="red">{loginError}</Text>}
          <Button
            type="submit"
            onClick={handleSubmit}
            data-cy="login-submit-button"
          >
            Submit
          </Button>
        </Stack>
      )}
    </>
  );
};

export default LogInModal;
