"use client";

import { Flex, Modal } from "@mantine/core";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { MdExitToApp } from "react-icons/md";
import {
  NavbarLink,
  NavigationLinks,
} from "@/app/_components/navigation/NavigationComponents";
import { useDisclosure } from "@mantine/hooks";
import LogInModal from "@/app/_components/account/LogInModal";
import UserContext from "@/app/context/UserContext";
import { FaCogs } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const userContext = useContext(UserContext);

  if (!userContext) {
    return <div>Loading </div>;
  }
  const { user } = userContext;
  const links = NavigationLinks.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      onClick={() => router.push(link.route)}
    />
  ));

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Switch Accounts"
        zIndex={1000}
        size="sm"
      >
        <LogInModal />
      </Modal>
      <nav
        style={{
          left: 0,
          top: 0,
          position: "fixed",
          width: "4rem",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#002b5c",
          justifyContent: "space-evenly",
          alignItems: "center",
          color: "white",
        }}
      >
        <Flex
          direction="column"
          m="auto"
          justify="space-between"
          display="flex"
        >
          {user && links}
          {user?.role == 1 && (
            <NavbarLink
              icon={FaCogs}
              label="Admin area"
              onClick={() => router.push("/admin")}
            />
          )}
        </Flex>
        {user == null ? (
          <NavbarLink icon={MdExitToApp} label="Log In" bottom onClick={open} />
        ) : (
          <NavbarLink
            icon={MdExitToApp}
            label="Log Out"
            bottom
            onClick={open}
          />
        )}
      </nav>
    </>
  );
}
