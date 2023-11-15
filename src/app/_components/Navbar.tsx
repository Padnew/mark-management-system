"use client";

import { MantineProvider} from '@mantine/core'
import React from 'react'
import { useRouter } from 'next/navigation'
import { MdExitToApp } from 'react-icons/md'
import { NavbarLink, NavigationLinks } from '@/resources/NavigationComponents';

export default function Navbar() {
  const router = useRouter();
  const links = NavigationLinks.map((link) => (
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
    <NavbarLink icon={MdExitToApp} label="Change account" bottom/>
</nav>
  </MantineProvider>

);
  
}
