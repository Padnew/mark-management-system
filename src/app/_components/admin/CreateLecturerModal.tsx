import { isValidUser } from '@/app/helpers/UserHelper';
import { User } from '@/app/types';
import { Button, Stack, TextInput } from '@mantine/core';
import React, { useState } from 'react';

interface Props {
  onCreate: () => void; 
}

function CreateLecturerModal({ onCreate }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  async function createLecturer() {
    const newLecturer : User = {user_id: 0, first_name: firstName, last_name: lastName, email: email.toLowerCase(), role: 1};

    if(isValidUser(newLecturer)){
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lecturer/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, email: email }),
    });
    if(response.ok){
      onCreate();
    }
    }
  }

  return (
    <Stack>
      <TextInput placeholder='John' type='text' value={firstName} onChange={(e) => setFirstName(e.target.value)} label='First name:' minLength={2}/>
      <TextInput placeholder='Smith' type='text' value={lastName} onChange={(e) => setLastName(e.target.value)} label='Last Name:'  minLength={2}/>
      <TextInput placeholder='john@strath.ac.uk' type='email' value={email} onChange={(e) => setEmail(e.target.value)} label='Email:'/>
      <Button color='green' onClick={createLecturer} mt={5}>Create Lecturer</Button>
    </Stack>
  );
}

export default CreateLecturerModal;