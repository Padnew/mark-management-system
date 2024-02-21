"use client";
import { Result, Student } from '@/app/types'
import { Center, Grid, GridCol, Group, Paper, RingProgress, Stack, Text, Title } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { FaBook } from 'react-icons/fa';

interface props{
    student: Student
}

const fetchStudentMarks = async (student: Student) => {
    const regNumber = student.reg_number;
    const year = new Date().getFullYear().toString()
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/results/detailed`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regNumber, year}),
    });
    if (!res.ok) {
      throw new Error('Failed to fetch classes');
    }
    return res.json();
  };

export default function StudentInformationModal({student}: props) {
    const [studentResults, setStudentResults] = useState<Result[] | undefined>([]);
    useEffect(() => {
        const fetchData = async () =>{
            const results = await fetchStudentMarks(student);
            setStudentResults(results);
        }
        fetchData()
      }, [student]);

      const averageAcrossClasses: number = parseFloat((studentResults!.reduce((prev, curr) => {
        return prev + curr.mark;
      }, 0) / studentResults!.length).toFixed(1));

      const averageColour = averageAcrossClasses > 0 && averageAcrossClasses <= 39 ? 'red' : averageAcrossClasses >=40  && averageAcrossClasses <= 55 ? 'orange' : averageAcrossClasses >=56  && averageAcrossClasses <= 69 ? 'yellow' : 'green'

  return (
    <>
    <Title order={3}>{student.name}</Title>
    <Grid>
        <GridCol span={6}>
        <Paper withBorder radius="md" p="xs">
            <Group>
                <Stack gap={0}>
          <Text c="dimmed" size="md">
              Class Average
            </Text>
            <Text size="xl">
              {averageAcrossClasses}%
            </Text>
            </Stack>
        <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: averageAcrossClasses, color: averageColour }]}
            label={
              <Center>
                <FaBook  />
              </Center>
            }
          />
          </Group>
          </Paper>
        </GridCol>
        <GridCol span={6}>
            <Paper withBorder radius="md" p="xs">
            <Group>
            <Text>Classes Submitted</Text>
            <Text>{studentResults?.length} / 6</Text>
            </Group>
            </Paper>
        </GridCol>
    </Grid>
    <Grid>
        <GridCol span={6}>

        </GridCol>
        <GridCol span={6}>

        </GridCol>
    </Grid>
    </>
  )
}
