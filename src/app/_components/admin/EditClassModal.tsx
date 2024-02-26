import { ClassType, User } from "@/app/types";
import { Alert, Button, Group, Select, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";

interface Props {
  classType: ClassType;
  lecturers: User[];
  onUpdate: () => void;
}

function EditClassModal({ classType, lecturers, onUpdate }: Props) {
  const [className, setClassName] = useState(classType.class_name);
  const [credits, setCredits] = useState(classType.credits);
  const [lecturer, setLecturer] = useState(classType.user_id);
  const [classCode, setClassCode] = useState(classType.class_code);
  const [creditLevel, setCreditLevel] = useState(classType.credit_level);
  const [locked, setLocked] = useState(classType.locked);

  async function updateClass() {
    if (
      className == classType.class_name &&
      credits == classType.credits &&
      lecturer == classType.user_id &&
      creditLevel == classType.credit_level &&
      locked == classType.locked
    ) {
      return (
        <Alert variant="light" color="red" title="Not updated" withCloseButton>
          Class not updated due to no change in data
        </Alert>
      );
    } else {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            className,
            credits,
            lecturer,
            classCode,
            creditLevel,
          }),
        }
      );
      if (response.ok) {
        onUpdate();
      }
    }
  }
  const setClassLockedStatus = async () => {
    const lockedNumber = locked ? 0 : 1;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/classes/locked`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classCode, lockedNumber }),
      }
    );
    if (!res.ok) {
      throw new Error("Failed to lock class");
    } else {
      console.log(res.text);
      setLocked(!locked);
    }
  };

  return (
    <Stack>
      <TextInput type="text" value={classCode} label="Class Code:" disabled />
      <TextInput
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        label="Class Name:"
      />
      <TextInput
        type="text"
        value={credits === 0 ? "" : credits}
        onChange={(e) => {
          const newValue = e.target.value;
          setCredits(newValue === "" ? 0 : Number(newValue));
        }}
        label="Credits:"
      />
      <TextInput
        type="text"
        value={creditLevel === 0 ? "" : creditLevel}
        onChange={(e) => {
          const newValue = e.target.value;
          setCreditLevel(newValue === "" ? 0 : Number(newValue));
        }}
        label="Credit Level:"
      />
      <Select
        label="Selected lecturer"
        value={
          lecturer
            ? `${
                lecturers.find((lec) => {
                  return lec.user_id == lecturer;
                })?.first_name
              } ${
                lecturers.find((lec) => {
                  return lec.user_id == lecturer;
                })?.last_name
              }`
            : ""
        }
        onChange={(value) => setLecturer(Number(value))}
        data={lecturers.map((lecturer) => ({
          value: lecturer.user_id.toString(),
          label: `${lecturer.first_name} ${lecturer.last_name}`,
        }))}
      />
      <Group grow>
        <Button color="green" onClick={updateClass} size="lg">
          Update
        </Button>
        {locked ? (
          <Button
            leftSection={<FaLock />}
            color="green"
            size="lg"
            variant="outline"
            onClick={setClassLockedStatus}
          >
            Unlock class
          </Button>
        ) : (
          <Button
            leftSection={<FaLock />}
            color="red"
            size="lg"
            variant="outline"
            onClick={setClassLockedStatus}
          >
            Lock class
          </Button>
        )}
      </Group>
    </Stack>
  );
}

export default EditClassModal;
