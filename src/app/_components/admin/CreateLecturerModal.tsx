import { isValidUser } from "@/app/helpers/UserHelper";
import { User } from "@/app/types";
import { Button, Stack, TextInput, Text } from "@mantine/core";
import React, { useState } from "react";

interface Props {
  onCreate: () => void;
}

function CreateLecturerModal({ onCreate }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [errorCreatingLecturer, setErrorCreatingLecturer] = useState(false);

  async function createLecturer() {
    setErrorCreatingLecturer(false);
    const newLecturer: User = {
      user_id: 0,
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      role: 1,
    };

    if (isValidUser(newLecturer)) {
      const password = newLecturer.first_name.toLowerCase();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/lecturer/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: password,
          }),
        }
      );
      if (response.ok) {
        onCreate();
      }
    } else {
      setErrorCreatingLecturer(true);
    }
  }

  return (
    <Stack data-cy="create-lecturer-modal">
      <TextInput
        placeholder="John"
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        label="First name:"
        minLength={2}
        data-cy="lecturer-first-textbox"
      />
      <TextInput
        placeholder="Smith"
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        label="Last Name:"
        minLength={2}
        data-cy="lecturer-last-textbox"
      />
      <TextInput
        placeholder="john@strath.ac.uk"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        label="Email:"
        data-cy="lecturer-email-textbox"
      />
      <Button
        color="green"
        onClick={createLecturer}
        mt={5}
        data-cy="create-lecturer-button"
      >
        Create Lecturer
      </Button>
      {errorCreatingLecturer && (
        <Text data-cy="error-creating-lecturer" c="red">
          Error creating new lecturer please check details
        </Text>
      )}
    </Stack>
  );
}

export default CreateLecturerModal;
