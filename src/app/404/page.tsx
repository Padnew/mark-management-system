"use client";
import React from 'react'
import PageHeader from '../_components/shared/PageHeader'
import { Button, Center, Stack, Title } from '@mantine/core'
import { useRouter } from 'next/navigation'

function Page() {
  const router = useRouter();
  return (
    <>
    <PageHeader heading='404' subHeading={"You shouldn't be here..."}/>
      <Stack align='center'>
    <Title order={2}>
        Either you are not logged in or the page is inaccessible, please log in and try access the page again!
    </Title>
        <Button onClick={()=>router.push('/')} size='xl' w='fit-content' variant='outline'>Return home</Button>
        </Stack>
    </>
  )
}

export default Page