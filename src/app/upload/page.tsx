"use client";
import React, { useState } from 'react'
import PageHeader from '../_components/PageHeader'
import { Button, Container, Group, Select } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {FaCloudUploadAlt, FaCross, FaDownload} from 'react-icons/fa'

const classes = ['Software Testing @ CS2024', 'Functional Thinking @ CS2023', 'Computer Security @ CS2020', 'Mobile App Development @ SE2021']

export default function page() {
  const [uploadStatus, setUploadStatus] = useState(false);
  return (
    <>
    <PageHeader heading={'Upload'} subHeading={'Upload student marks'}/>
    <Container size={700} mt={40}>
    <Select data={classes} label='Please select a class from your taught classes' onSelect={() => {setUploadStatus(true)}}/>
    <Container mt={25} ta="center" style={{border: '1px dashed black', borderRadius: '5px'}} p={20}>
      <Dropzone
        onDrop={() => {}}
        accept={[MIME_TYPES.csv]}
      >
        <div style={{ pointerEvents: 'none' }}>
          <Group justify="center">
            <Dropzone.Idle>
              <FaCloudUploadAlt size={50} />
            </Dropzone.Idle>
          </Group>
          <p>
            <Dropzone.Idle>Upload CSV</Dropzone.Idle>
          </p>
          <p style={{color:"red"}}>
            Please ensure CSV is in the same format provided from MyPlace or it will be rejected!
          </p>
        </div>
      </Dropzone>
      <Button size="md" radius="xl" justify='center' mt={20}>
        Select files
      </Button>
    </Container>
    </Container>
    </>
    )
}
