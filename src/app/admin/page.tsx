"use client";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../_components/shared/PageHeader";
import {
  Button,
  Grid,
  GridCol,
  Group,
  LoadingOverlay,
  Modal,
  Table,
  Title,
} from "@mantine/core";
import { FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { EditButton } from "../_components/shared/EditButton";
import { ClassType, Lecturer, User } from "../types";
import EditClassModal from "../_components/admin/EditClassModal";
import CreateClassModal from "../_components/admin/CreateClassModal";
import CreateLecturerModal from "../_components/admin/CreateLecturerModal";
import UserContext from "../context/UserContext";
import { useRouter } from "next/navigation";
import ConfirmResetAssignedLecturersModal from "../_components/admin/ConfirmResetAssignedLecturersModal";
import ClearExcessStudentsModal from "../_components/admin/ClearExcessStudentsModal";

export default function Page() {
  const [classes, setClasses] = useState<ClassType[] | undefined>([]);
  const [lecturers, setLecturers] = useState<Lecturer[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [updateClassModalOpened, setUpdateClassModalOpened] = useState(false);
  const [createModalOpened, setCreateModalOpened] = useState(false);
  const [lecturerModalOpened, setLecturerModalOpened] = useState(false);
  const [resetAssignedLecturersModal, setResetAssignedLecturersModal] =
    useState(false);
  const [clearStudentsModal, setClearStudentsModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const userContext = useContext(UserContext);
  const router = useRouter();

  if (
    userContext &&
    !userContext.isLoadingUser &&
    userContext.user?.role == 2
  ) {
    router.push("/404");
  }

  async function fetchClasses() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`);
    if (!res.ok) {
      throw new Error("Failed to fetch classes");
    }
    const data = await res.json();
    setClasses(data);
    setUpdateClassModalOpened(false);
  }

  async function fetchLecturers() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lecturers`);
    if (!res.ok) {
      throw new Error("Failed to fetch lecturers");
    }
    const data = await res.json();
    setLecturers(data);
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        await fetchClasses();
        await fetchLecturers();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleCreateClass = () => {
    fetchClasses();
    setCreateModalOpened(false);
  };
  const handleResetLecturers = () => {
    fetchClasses();
    setResetAssignedLecturersModal(false);
  };

  const handleCreateLecturer = () => {
    fetchLecturers();
    setLecturerModalOpened(false);
  };

  const handleCloseModal = () => {
    setCreateModalOpened(false);
    setLecturerModalOpened(false);
    setUpdateClassModalOpened(false);
  };

  const classRows = classes!.map((classType) => (
    <Table.Tr key={classType.class_code} bg={classType.locked ? "red" : ""}>
      <Table.Td>{classType.class_code}</Table.Td>
      <Table.Td>{classType.class_name}</Table.Td>
      <Table.Td>{classType.credit_level}</Table.Td>
      <Table.Td>{classType.credits}</Table.Td>
      <Table.Td>{classType.user_id ?? "Unassigned"}</Table.Td>
      <Table.Td>
        <EditButton
          onclick={() => {
            setSelectedClass(classType);
            setUpdateClassModalOpened(true);
          }}
          label={`Edit ${classType.class_code}`}
          icon={<FaEye />}
        />
      </Table.Td>
    </Table.Tr>
  ));

  const lecturerRows = lecturers!.map((lecturer) => (
    <Table.Tr key={lecturer.user_id}>
      <Table.Td>{lecturer.user_id}</Table.Td>
      <Table.Td>{lecturer.first_name}</Table.Td>
      <Table.Td>{lecturer.last_name}</Table.Td>
      <Table.Td>{lecturer.email}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <PageHeader
        heading={"Admin"}
        subHeading={"Manage Lecturers and Classes"}
      />
      <Group py={10} pl={5} align="flex-end" data-cy="admin-control-section">
        <Button
          leftSection={<FaPlus />}
          variant="outline"
          color="green"
          size="md"
          onClick={() => setCreateModalOpened(true)}
          data-cy="create-class-modal-button"
        >
          Add new class
        </Button>
        <Button
          leftSection={<FaPlus />}
          variant="outline"
          color="green"
          size="md"
          onClick={() => setLecturerModalOpened(true)}
          data-cy="create-lecturer-modal-button"
        >
          Add new lecturer
        </Button>
        <Button
          leftSection={<FaTrash />}
          variant="outline"
          color="red"
          size="md"
          onClick={() => setClearStudentsModal(true)}
          data-cy="clear-excess-students-button"
        >
          Clear excess students
        </Button>
        <Button
          leftSection={<FaTrash />}
          variant="outline"
          color="red"
          size="md"
          onClick={() => setResetAssignedLecturersModal(true)}
          data-cy="reset-assigned-lecturers-button"
        >
          Unassigned all Lecturers
        </Button>
      </Group>
      <hr />
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Grid mx={10}>
        <GridCol span={6}>
          <Title>Classes</Title>
          <Table striped highlightOnHover withColumnBorders withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Td>Class Code</Table.Td>
                <Table.Td>Class Name</Table.Td>
                <Table.Td>Credit Level</Table.Td>
                <Table.Td>Credits</Table.Td>
                <Table.Td>Lecturer</Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{classRows}</Table.Tbody>
          </Table>
        </GridCol>
        <GridCol span={6}>
          <Title>Lecturers</Title>
          <Table striped highlightOnHover withColumnBorders withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Td>User ID</Table.Td>
                <Table.Td>First Name</Table.Td>
                <Table.Td>Last Name</Table.Td>
                <Table.Td>Email</Table.Td>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{lecturerRows}</Table.Tbody>
          </Table>
        </GridCol>
      </Grid>

      <Modal
        opened={updateClassModalOpened}
        onClose={handleCloseModal}
        title="Update Class"
      >
        <EditClassModal
          lecturers={lecturers || []}
          classType={selectedClass!}
          onUpdate={fetchClasses}
        />
      </Modal>
      <Modal
        opened={createModalOpened}
        onClose={handleCloseModal}
        title="Create New Class"
      >
        <CreateClassModal
          lecturers={lecturers || []}
          onCreate={handleCreateClass}
        />
      </Modal>
      <Modal
        opened={lecturerModalOpened}
        onClose={handleCloseModal}
        title="Create New Lecturer"
      >
        <CreateLecturerModal onCreate={handleCreateLecturer} />
      </Modal>
      <Modal
        opened={resetAssignedLecturersModal}
        onClose={handleCloseModal}
        title="Reset assigned lecturers?"
      >
        <ConfirmResetAssignedLecturersModal
          onClear={handleResetLecturers}
          closeModal={() => setResetAssignedLecturersModal(false)}
        />
      </Modal>
      <Modal
        opened={clearStudentsModal}
        onClose={handleCloseModal}
        title="Clear excess students"
      >
        <ClearExcessStudentsModal
          closeModal={() => setClearStudentsModal(false)}
        />
      </Modal>
    </>
  );
}
