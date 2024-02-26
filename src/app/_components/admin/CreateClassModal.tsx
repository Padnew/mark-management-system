import { ClassType, User } from "@/app/types";
import { Button, Select, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";

interface Props {
  lecturers: User[];
  onCreate: () => void;
}

function CreateClassModal({ lecturers, onCreate }: Props) {
  const [className, setClassName] = useState("");
  const [credits, setCredits] = useState(0);
  const [lecturer, setLecturer] = useState<number | undefined>(undefined);
  const [classCode, setClassCode] = useState("");
  const [creditLevel, setCreditLevel] = useState(0);

  async function createClass() {
    const locked = false;
    const newClass = {
      class_code: classCode,
      class_name: className,
      credits,
      user_id: lecturer,
      credit_level: creditLevel,
      locked: locked,
    };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/classes/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classCode,
          className,
          creditLevel,
          credits,
          locked,
          lecturer,
        }),
      }
    );
    if (response.ok) {
      onCreate();
    }
  }

  return (
    <Stack>
      <TextInput
        placeholder="PH161"
        type="text"
        value={classCode}
        onChange={(e) => setClassCode(e.target.value)}
        label="Class Code:"
      />
      <TextInput
        placeholder="Universe and Everything"
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        label="Class Name:"
      />
      <TextInput
        placeholder="20"
        type="number"
        value={credits === 0 ? "" : credits}
        onChange={(e) => {
          const newValue = e.target.value;
          setCredits(newValue === "" ? 0 : Number(newValue));
        }}
        label="Credits:"
      />
      <TextInput
        placeholder="2"
        type="number"
        value={creditLevel === 0 ? "" : creditLevel}
        onChange={(e) => {
          const newValue = e.target.value;
          setCreditLevel(newValue === "" ? 0 : Number(newValue));
        }}
        label="Credit Level:"
      />
      <Select
        placeholder="No Lecturer chosen"
        label="Select Lecturer"
        value={lecturer?.toString() || ""}
        onChange={(value) => setLecturer(Number(value))}
        data={lecturers.map((lecturer) => ({
          value: lecturer.user_id.toString(),
          label: `${lecturer.first_name} ${lecturer.last_name}`,
        }))}
      />
      <Button color="green" onClick={createClass} mt={5}>
        Create Class
      </Button>
    </Stack>
  );
}

export default CreateClassModal;
