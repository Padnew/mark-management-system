"use client";
import { CalculateClassAverages } from "@/app/helpers/StatisticsHelper";
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
import { PiArrowDownRight, PiArrowUpRight } from "react-icons/pi";

interface props {
  student: Student;
}

async function fetchStudentMarks(student: Student) {
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
}

async function fetchClassResults(classes: string[]) {
  const year = new Date().getFullYear().toString();
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/results/classes`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classes, year }),
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch classes");
  }
  return res.json();
}

export default function StudentInformationModal({ student }: props) {
  const [studentResults, setStudentResults] = useState<Result[] | undefined>(
    []
  );
  const [classResults, setClassResults] = useState<Result[] | undefined>([]);
  useEffect(() => {
    const fetchData = async () => {
      const results: Result[] = await fetchStudentMarks(student);
      const classCodes: string[] = results.map((result) => result.class_code);
      const classResults = await fetchClassResults(classCodes);
      setStudentResults(results);
      setClassResults(classResults);
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

  const averageMarkByClass = CalculateClassAverages(classResults || []);
  return (
    <>
      <Title order={2} mb="md">
        {student.name}
      </Title>
      <Grid>
        <Grid.Col span={7}>
          <Paper withBorder radius="md" ta="center">
            <Group justify="center">
              <Stack gap={0} pl="md">
                <Text c="dimmed" size="md">
                  Student Class Average
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
        {studentResults?.map((result) => {
          if (result.year === "2024") {
            const classAverage = averageMarkByClass.find(
              (classMark) => classMark.classKey === result.class_code
            )?.average;

            return (
              <Paper
                key={result.class_code}
                withBorder
                radius="md"
                ta={"center"}
              >
                <Stack gap={0} ta="center">
                  <Text size="md">{result.class_code}</Text>
                  <Group gap={0} justify="center">
                    <Text
                      size="xl"
                      c={(classAverage ?? 0) > result.mark ? "red" : "green"}
                    >
                      {result.mark}%
                    </Text>
                    {(classAverage ?? 0) > result.mark ? (
                      <PiArrowDownRight color="red" />
                    ) : (
                      <PiArrowUpRight color="green" />
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    Cohort Average: {classAverage ?? "Not Found"}%
                  </Text>
                </Stack>
              </Paper>
            );
          }
          return null;
        })}
      </SimpleGrid>
    </>
  );
}
