"use client";

import { MantineProvider, Stack, Tooltip} from '@mantine/core'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AiOutlineHome, AiOutlineLineChart, AiOutlineUpload } from 'react-icons/ai'
import { MdExitToApp } from 'react-icons/md'

interface NavbarLinkProps {
  icon: React.ComponentType<{ size: number }>;
  label: string;
  onClick?(): void;
  bottom? : boolean
}

function NavbarLink({ icon: Icon, label, onClick, bottom }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right">
    <div onClick={onClick} className={bottom ? 'nav-button-bottom' : 'nav-button-link'}>
      <Icon size={40}/>
    </div>
  </Tooltip>
  );
}

const navigationLinks = [
  { icon: AiOutlineHome, label: 'Home', route : '/' },
  { icon: AiOutlineLineChart, label: 'Analytics', route : '/analytics' },
  { icon: AiOutlineUpload, label: 'Upload', route : '/upload' },
];

export default function Navbar() {
  const router = useRouter();
const links = navigationLinks.map((link) => (
  <NavbarLink
    {...link}
    key={link.label}
    onClick={() => router.push(link.route)}
  />
));

return (
  <MantineProvider>
  <nav className='navbar'>
    <div className='navbar-page-links'>
  {links}
  </div>
  {/* <Stack justify='center' gap={0}> */}
    <NavbarLink icon={MdExitToApp} label="Change account" bottom/>
  {/* </Stack> */}
</nav>
  </MantineProvider>

);
  
}
