import { Container, MantineProvider } from '@mantine/core'
import React from 'react'

function PageHeader({heading, subHeading} : any) {
  return (
    <div className='page-header'>
        <h2>{subHeading}</h2>
        <h1>{heading}</h1>
        <hr/>
    </div>
  )
}

export default PageHeader;
