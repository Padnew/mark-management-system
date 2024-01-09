"use client";
import React, {useEffect, useState } from 'react';
import PageHeader from '../_components/PageHeader';
import { Table } from '@mantine/core';

async function getData(): Promise<Student[]> {
  const res = await fetch('http://localhost:20502/students')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

interface Student{
  reg_number: string;
  name: string;
  degree_name: string;
  degree_level: string;
}

export default function Page() {
  const [students, setStudents] = useState<Student[] | undefined>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: Student[] = await getData();
        setStudents(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const rows = students!.map((student) => (
    <Table.Tr key={student.reg_number}>
      <Table.Td>{student.reg_number}</Table.Td>
      <Table.Td>{student.name}</Table.Td>
      <Table.Td>{student.degree_name}</Table.Td>
      <Table.Td>{student.degree_level}</Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <PageHeader heading='Students' subHeading='Raw student view' />
      <Table stickyHeader>
        <Table.Thead>
        <Table.Tr>
          <Table.Th>Reg Number</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Degree Name</Table.Th>
          <Table.Th>Degree Level</Table.Th>
        </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}