"use client";
import { useContext } from "react";
import PageHeader from "./_components/shared/PageHeader";
import UserContext from "./context/UserContext";
import { Blockquote, Title } from "@mantine/core";
import { FaInfo } from "react-icons/fa";

export default function Home() {
  const userContext = useContext(UserContext);

  if (!userContext) {
    return <div>Loading</div>;
  }
  const { user } = userContext;
  return (
    <>
      <PageHeader
        heading={"Dashboard"}
        subHeading={user != null && `Welcome back, ${user?.first_name}!`}
      />
      <Blockquote
        ml="xl"
        mr="xl"
        color="#002b5c"
        cite="– Strath Dev Team"
        icon={<FaInfo />}
        mt="xl"
        fz="lg"
        data-cy="dashboard-page-quote"
      >
        <Title order={2}>Welcome to your new Mark Management System!</Title>
        Here you will be able to view a plethora of student information, upload
        class and assignment marks, gain insights into student performance
        through the basic and also the enhanced analytics view to better make
        student outcome decisions. You can view student circumstances around
        assignments, exams and other marks which will decide their final outcome
        from both the exam board and lecturers alike.
      </Blockquote>
    </>
  );
}
