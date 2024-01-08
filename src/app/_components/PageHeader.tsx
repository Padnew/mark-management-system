import {Group, Image, Stack } from '@mantine/core'
import React from 'react'
import image from 'public/MainLogo.png'
function PageHeader({ heading, subHeading }: any) {
  return (
    <>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: 'calc(100vw - 5.5rem)',
          alignItems: "flex-start"
        }}>
        <Stack gap={0}>
          <h2 style={{ fontSize: '2rem', color: 'darkgray' }}>{subHeading}</h2>
          <h1 style={{ fontSize: '3.5rem', color: 'black' }}>{heading}</h1>
        </Stack>
        <Image
          radius="md"
          src={image.src}
          alt="StrathLogoBanner"
          h={100}
          w="auto"
          fit="contain"
          style={{ right: 0, marginTop: '0.5rem' }}
        />
        </div>
      <hr />
    </>
  );
}

export default PageHeader;
