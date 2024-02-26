import React, { useRef, useState } from "react";
import { Button, Container, Group, Select, Text } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { FaCloudUploadAlt } from "react-icons/fa";
import { CSVRow, ClassType, Student } from "@/app/types";
import Papa from "papaparse";

interface CSVResult {
  class_code: string;
  reg_number: string;
  mark: number;
  unique_code: string;
  year: string;
}

interface Props {
  classes: ClassType[];
}

function DropzoneComponent({ classes }: Props) {
  const [uploadStatus, setUploadStatus] = useState(false);
  const [validationError, setValidationError] = useState("");
  const openRef = useRef<() => void>(null);

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    Papa.parse<CSVRow>(file, {
      header: true,
      skipEmptyLines: "greedy",
      complete: async (result) => {
        const students: Student[] = [];
        const results: CSVResult[] = [];

        result.data.forEach((row: CSVRow) => {
          const student: Student = {
            reg_number: row.RegistrationNumber,
            name: row.Student,
            degree_name: row.CourseName,
            degree_level: row.DegreeLevel,
          };

          const result: CSVResult = {
            class_code: row.ClassCode,
            reg_number: row.RegistrationNumber,
            mark: parseInt(row.Result),
            unique_code: row.UniqueCode,
            year: new Date().getFullYear().toString(),
          };

          students.push(student);
          results.push(result);
        });
        try {
          await submitData(
            students,
            `${process.env.NEXT_PUBLIC_API_URL}/students/create`
          );
          await submitData(
            results,
            `${process.env.NEXT_PUBLIC_API_URL}/results/create`
          );
          console.log("Data submitted successfully.");
        } catch (error) {
          console.error("Error submitting data:", error);
        }
      },
      error: (error) => console.error("Error parsing CSV:", error.message),
    });
  };

  const submitData = async (
    data: Student[] | CSVResult[],
    endpoint: string
  ) => {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit data to ${endpoint}`);
      }
      setUploadStatus(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <Container size={800}>
      <Select
        data={classes.map((classType) => ({
          value: classType.class_code.toString(),
          label: `${classType.class_code}: ${classType.class_name}`,
        }))}
        label="Please select a class from your taught classes"
      />
      <Container
        mt={25}
        ta="center"
        style={{ border: "2px dashed black", borderRadius: "5px" }}
        p={80}
        fz={30}
      >
        <Dropzone
          openRef={openRef}
          onDrop={handleFileUpload}
          accept={[MIME_TYPES.csv]}
        >
          <div style={{ pointerEvents: "none" }}>
            <Group justify="center">
              <Dropzone.Idle>
                <FaCloudUploadAlt size={50} />
              </Dropzone.Idle>
              <Dropzone.Accept>
                <FaCloudUploadAlt size={50} />
              </Dropzone.Accept>
            </Group>
            <Text>
              <Dropzone.Idle>Upload CSV</Dropzone.Idle>
            </Text>
            <Text c="red">
              Please ensure CSV is in the same format provided or it will be
              rejected!
            </Text>
          </div>
        </Dropzone>
        {validationError && <Text c="red">{validationError}</Text>}
        <Button
          onClick={() => openRef.current?.()}
          size="md"
          radius="xl"
          justify="center"
          mt={20}
        >
          Select files
        </Button>
      </Container>
    </Container>
  );
}

export default DropzoneComponent;
