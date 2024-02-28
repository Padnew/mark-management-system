"use client";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../_components/shared/PageHeader";
import {
  Button,
  Group,
  Input,
  LoadingOverlay,
  Modal,
  Table,
} from "@mantine/core";
import { Student } from "../types";
import UserContext from "../context/UserContext";
import { useRouter } from "next/navigation";
import { EditButton } from "../_components/shared/EditButton";
import { FaChartLine, FaEye, FaFileExport } from "react-icons/fa";
import StudentInformationModal from "../_components/students/StudentInformationModal";

async function getData(userId: number, role: number): Promise<Student[]> {
  const res =
    role == 2
      ? await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/${userId}`)
      : await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/all`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Page() {
  const userContext = useContext(UserContext);
  const [students, setStudents] = useState<Student[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    regNumber: "",
    name: "",
    degreeName: "",
    degreeLevel: "",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [openStudentModal, setOpenStudentModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (userContext?.user) {
        try {
          const data = await getData(
            userContext.user.user_id,
            userContext.user.role
          );
          setStudents(data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    if (userContext && !userContext.isLoadingUser) {
      fetchData();
      setLoading(false);
    }
  }, [userContext, userContext?.user, userContext?.isLoadingUser]);

  const handleFilterChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const filteredStudents = students?.filter(
    (student) =>
      student.reg_number.includes(filters.regNumber) &&
      student.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      student.degree_name
        .toLowerCase()
        .includes(filters.degreeName.toLowerCase()) &&
      student.degree_level
        .toLowerCase()
        .includes(filters.degreeLevel.toLowerCase())
  );

  if (!userContext?.isLoadingUser && !userContext?.user) {
    router.push("/404");
  }

  const studentRows = filteredStudents!.map((student) => (
    <Table.Tr key={student.reg_number}>
      <Table.Td>{student.reg_number}</Table.Td>
      <Table.Td>{student.name}</Table.Td>
      <Table.Td>{student.degree_name}</Table.Td>
      <Table.Td>{student.degree_level}</Table.Td>
      <Table.Td>
        <EditButton
          icon={<FaEye />}
          label="View stats"
          onclick={() => {
            setSelectedStudent(student);
            setOpenStudentModal(true);
          }}
        />
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <PageHeader
        heading="Students"
        subHeading="View and export student information"
      />
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Group py={10} pl={5} align="flex-end">
        <Button
          leftSection={<FaFileExport />}
          variant="outline"
          color="green"
          size="md"
          onClick={() => {}}
        >
          Export filtered group
        </Button>
      </Group>
      <hr />
      <Table stickyHeader>
        <Table.Thead bg="transparent">
          <Table.Tr>
            <Table.Th>
              <Input
                type="number"
                name="reg_number"
                value={filters.regNumber}
                onChange={handleFilterChange}
                placeholder="Reg Number"
              />
            </Table.Th>
            <Table.Th>
              <Input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Name"
              />
            </Table.Th>
            <Table.Th>
              <Input
                type="text"
                name="degree_name"
                value={filters.degreeName}
                onChange={handleFilterChange}
                placeholder="Degree Name"
              />
            </Table.Th>
            <Table.Th>
              <Input
                type="text"
                name="degree_level"
                value={filters.degreeLevel}
                onChange={handleFilterChange}
                placeholder="Degree Level"
              />
            </Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{studentRows}</Table.Tbody>
      </Table>

      <Modal
        opened={openStudentModal}
        onClose={() => setOpenStudentModal(false)}
        title="Student information"
      >
        <StudentInformationModal student={selectedStudent!} />
      </Modal>
    </>
  );
}
