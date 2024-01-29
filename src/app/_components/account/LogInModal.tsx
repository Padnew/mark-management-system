import React, { useContext, useState } from "react";
import { Button, Group, TextInput, Stack, PasswordInput } from "@mantine/core";
import UserContext from '@/app/context/UserContext';

const LogInModal: React.FC = () => {
    const userContext = useContext(UserContext);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = async () => {
        if (userContext) {
            await userContext.login(username, password);
        }
    };

    return (
        <>
            {userContext?.user ? (
                <Group justify="space-between">
                    <Button size="lg" onClick={userContext.logout}>
                        Log me out
                    </Button>
                </Group>
            ) : (
                <Stack>
                    <TextInput
                        label="Email"
                        placeholder="lecturer@uni.ac.uk"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <PasswordInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Stack>
            )}
        </>
    );
}

export default LogInModal;