import { Button, Group, Stack, Title } from "@mantine/core";
import React from "react";
import { FaCheckCircle, FaThumbsUp, FaTimesCircle } from "react-icons/fa";

interface Props {
  onClear: () => void;
  closeModal: () => void;
}

export default function ConfirmResetAssignedLecturersModal({
  onClear,
  closeModal,
}: Props) {
  async function confirmResetAssignedLecturers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/reset`);
    if (!res.ok) {
      throw new Error("Failed to reset assigned lecturers");
    } else {
      onClear();
    }
  }
  return (
    <Stack ta="center">
      <Title order={3}>
        Are you sure you want to reset all assigned lecturers?
      </Title>
      <Title order={4}>
        This should ONLY be done at the end of an academic year
      </Title>
      <Group ta="center" grow>
        <Button
          leftSection={<FaCheckCircle />}
          color="green"
          onClick={confirmResetAssignedLecturers}
          size="lg"
        >
          Confirm
        </Button>
        <Button
          color="red"
          size="lg"
          onClick={closeModal}
          leftSection={<FaTimesCircle />}
        >
          Cancel
        </Button>
      </Group>
    </Stack>
  );
}
