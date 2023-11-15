import {Image, Stack } from '@mantine/core'
import React from 'react'
import image from 'public/MainLogo.png'
function PageHeader({heading, subHeading} : any) {
  return (
    <>
    <div className='page-header'>
      <Stack gap={0}>
        <h2>{subHeading}</h2>
        <h1>{heading}</h1>
      </Stack>
        <Image radius="md" src={image.src} alt='StrathLogoBanner' h={100} w="auto" fit="contain" ml='auto' mr={10}/>
    </div>
    <hr/>
    </>
  )
}

export default PageHeader;
