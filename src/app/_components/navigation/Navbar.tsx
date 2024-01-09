"use client";

import { Button, Group, Modal, Paper} from '@mantine/core'
import React from 'react'
import { useRouter } from 'next/navigation'
import { MdExitToApp } from 'react-icons/md'
import { NavbarLink, NavigationLinks } from '@/app/_components/navigation/NavigationComponents';
import { useDisclosure } from '@mantine/hooks';

export default function Navbar() {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  
  const links = NavigationLinks.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      onClick={() => router.push(link.route)}
    />
  ));
  return (
    <>
    <Modal opened={opened} onClose={close} title="Switch Accounts" zIndex={1000} size='auto' >
            <Group justify='space-between'>
    <Button size='lg'>Switch to Admin</Button>
    <Button size='lg'>Switch to Lecturer</Button>
    </Group>
      </Modal>
      <nav
        style={{
          left: 0,
          top: 0,
          position: 'fixed',
          width: '4rem',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#002b5c',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          color: 'white'
        }}
      >
        <div
          style={{
            flexDirection: 'column',
            margin: 'auto',
            justifyContent: 'space-between',
            display:'flex'
          }}
        >
          {links}
        </div>
        <NavbarLink
          icon={MdExitToApp}
          label="Change account"
          bottom
          onClick={open}
        />
      </nav>
    </>
  );
}