"use client";
import React, { useState, useContext, useEffect } from "react";
import PageHeader from "../_components/shared/PageHeader";
import DropzoneComponent from "../_components/upload/DropzoneComponent";
import UserContext from "../context/UserContext";
import { ClassType } from "../types";
import { useRouter } from "next/navigation";

async function getData(userId: number, role: number): Promise<ClassType[]> {
  const res =
    role == 2
      ? await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/classesByUser/${userId}`
        )
      : await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

export default function Page() {
  const userContext = useContext(UserContext);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchClasses = async () => {
      if (userContext?.user) {
        const data = await getData(
          userContext.user.user_id,
          userContext.user.role
        );
        setClasses(data);
      }
    };
    if (userContext && !userContext.isLoadingUser) {
      fetchClasses();
    }
  }, [userContext, userContext?.user, userContext?.isLoadingUser]);

  if (!userContext?.isLoadingUser && !userContext?.user) {
    router.push("/404");
  }

  return (
    <>
      <PageHeader heading={"Upload"} subHeading={"Upload student marks"} />
      <DropzoneComponent classes={classes} />
    </>
  );
}
