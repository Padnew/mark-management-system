"use client";
import { Result, Student } from "@/app/types";
import {
  Center,
  Grid,
  GridCol,
  Group,
  Paper,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { FaBook } from "react-icons/fa";

interface props {
  student: Student;
}

const fetchStudentMarks = async (student: Student) => {
  const regNumber = student.reg_number;
  const year = new Date().getFullYear().toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/results/detailed`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regNumber, year }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch classes");
  }
  return res.json();
};

export default function StudentInformationModal({ student }: props) {
  const [studentResults, setStudentResults] = useState<Result[] | undefined>(
    []
  );
  useEffect(() => {
    const fetchData = async () => {
      const results = await fetchStudentMarks(student);
      setStudentResults(results);
    };
    fetchData();
  }, [student]);

  const averageAcrossClasses: number = parseFloat(
    (
      studentResults!.reduce((prev, curr) => {
        return prev + curr.mark;
      }, 0) / studentResults!.length
    ).toFixed(1)
  );

  const averageColour =
    averageAcrossClasses > 0 && averageAcrossClasses <= 39
      ? "red"
      : averageAcrossClasses >= 40 && averageAcrossClasses <= 55
      ? "orange"
      : averageAcrossClasses >= 56 && averageAcrossClasses <= 69
      ? "yellow"
      : "green";

  const numberOfClassesSubmitted = studentResults?.map(
    (result) => result.year === "2024"
  ).length;
  return (
    <>
      <Title order={2} mb="md">
        {student.name}
      </Title>
      <Grid>
        <Grid.Col span={7}>
          <Paper withBorder radius="md" ta="center">
            <Group>
              <Stack gap={0} pl="md">
                <Text c="dimmed" size="md">
                  Class Average
                </Text>
                <Text size="xl">{averageAcrossClasses}%</Text>
              </Stack>
              <RingProgress
                size={80}
                roundCaps
                thickness={9}
                sections={[
                  { value: averageAcrossClasses, color: averageColour },
                ]}
                label={
                  <Center>
                    <FaBook />
                  </Center>
                }
                p={0}
                m={0}
              />
            </Group>
          </Paper>
        </Grid.Col>
        <Grid.Col span={5}>
          <Paper
            withBorder
            radius="md"
            ta="center"
            c={numberOfClassesSubmitted === 6 ? "green" : "default"}
          >
            <Stack gap={0} p="sm">
              <Text c="dimmed" size="md">
                Classes Submitted
              </Text>
              <Text size="xl">{numberOfClassesSubmitted} / 6</Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
      <SimpleGrid cols={3} mt={10}>
        {studentResults?.map((result) =>
          result.year == "2024" ? (
            <Paper key={result.class_code} withBorder radius="md" ta={"center"}>
              <Stack gap={0}>
                <Text c="dimmed" size="md">
                  {result.class_code}
                </Text>
                <Text size="xl">{result.mark}%</Text>
              </Stack>
            </Paper>
          ) : null
        )}
      </SimpleGrid>
    </>
  );
}
