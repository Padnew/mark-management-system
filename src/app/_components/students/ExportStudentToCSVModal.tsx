import { exportStudentsToCSV } from "@/app/helpers/StudentsHelper";
import { Student } from "@/app/types";
import { Button, Input, Select, Stack, TextInput } from "@mantine/core";
import React, { useState } from "react";
import { FaFileExport } from "react-icons/fa";

interface Props {
  students: Student[];
}

export default function ExportStudentToCSVModal({ students }: Props) {
  const [csvName, setCsvName] = useState("");
  const [selectedYear, setSelectedYear] = useState("All");
  const onChangeNameOfCSV = (event: React.FormEvent<HTMLInputElement>) => {
    setCsvName(event.currentTarget.value);
  };
  async function handleExportStudents() {
    exportStudentsToCSV(students, csvName);
  }
  return (
    <Stack>
      <TextInput
        label="Name of CSV:"
        value={csvName}
        onChange={onChangeNameOfCSV}
      />
      <Button
        onClick={handleExportStudents}
        color="Green"
        leftSection={<FaFileExport />}
      >
        Export
      </Button>
    </Stack>
  );
}
