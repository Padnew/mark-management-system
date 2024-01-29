"use client";

import { Modal} from '@mantine/core'
import React, { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { MdExitToApp } from 'react-icons/md'
import { NavbarLink, NavigationLinks } from '@/app/_components/navigation/NavigationComponents';
import { useDisclosure } from '@mantine/hooks';
import LogInModal from '@/app/_components/account/LogInModal';
import UserContext from '@/app/context/UserContext';
import { FaCogs } from 'react-icons/fa';

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
    <Modal opened={opened} onClose={close} title="Switch Accounts" zIndex={1000} size='auto' >
            <LogInModal/>
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
          {user?.role == 1 ?
        <NavbarLink icon={FaCogs} label="Admin area" onClick={() => router.push('/admin')}/>
        : <></>
        }
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