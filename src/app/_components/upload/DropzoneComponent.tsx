import React, { useState } from 'react'
import { Button, Container, Group, Select } from '@mantine/core'
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import {FaCloudUploadAlt} from 'react-icons/fa'


interface Class {
  class_code: string;
  class_name: string;
  credit_level: number;
  credits: number;
  locked: boolean;
  user_id: number;
}

interface Props{
  classes : Class[]
}

function DropzoneComponent() {
  const [uploadStatus, setUploadStatus] = useState(false);
  const classes = ['Software Testing @ CS2024', 'Functional Thinking @ CS2023', 'Computer Security @ CS2020', 'Mobile App Development @ SE2021']

  return (
    <Container size={800}> 
    <Select data={classes} label='Please select a class from your taught classes' onSelect={() => {setUploadStatus(true)}}/>
    <Container mt={25} ta="center" style={{border: '2px dashed black', borderRadius: '5px'}} p={80} fz={30}>
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
            Please ensure CSV is in the same format provided or it will be rejected!
          </p>
        </div>
      </Dropzone>
      <Button size="md" radius="xl" justify='center' mt={20}>
        Select files
      </Button>
    </Container>
    </Container>
  )
}

export default DropzoneComponent