import { Button, Group, Stack, Title } from "@mantine/core";
import React from "react";
import { FaCheckCircle, FaThumbsUp, FaTimesCircle } from "react-icons/fa";

interface Props {
  closeModal: () => void;
}

export default function ClearExcessStudents({ closeModal }: Props) {
  async function clearExcessStudents() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/students/clear`
    );
    if (!res.ok) {
      throw new Error("Failed to clear excess students");
    }
  }
  return (
    <Stack ta="center" data-cy="confirm-clear-students-modal">
      <Title order={3}>
        Are you sure you want to clear excess students in the system?
      </Title>
      <Title order={4}>
        This will REMOVE any students who do not have any marks in the system
      </Title>
      <Group ta="center" grow>
        <Button
          leftSection={<FaCheckCircle />}
          color="green"
          onClick={clearExcessStudents}
          size="lg"
          data-cy="confirm-clear-students-button"
        >
          Confirm
        </Button>
        <Button
          color="red"
          size="lg"
          onClick={closeModal}
          leftSection={<FaTimesCircle />}
          data-cy="cancel-clear-students-button"
        >
          Cancel
        </Button>
      </Group>
    </Stack>
  );
}
