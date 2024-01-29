"use client";
import { useContext } from 'react';
import PageHeader from './_components/shared/PageHeader'
import UserContext from './context/UserContext'

export default function Home() {

  const userContext = useContext(UserContext);

  if (!userContext) {
    return <div>Loading </div>; 
  }
  const { user } = userContext;
  return (
    <>
    <PageHeader heading={'Dashboard'} subHeading={`Welcome ${user != null ? user?.first_name : 'User'}`}/>
    <div style={{fontSize:'1.5rem', marginRight:'10rem', paddingLeft:'1rem'}}>
      <h2>Welcome to your new Mark Management System!</h2>
      <div>
        Here you will be able to view a plethora of student information, upload class and assignment marks, gain insights into student performance 
        through the basic and also the enhanced analytics view to better make student outcome decisions. You can view student circumstances
        around assignments, exams and other marks which will decide their final outcome from both the exam board and lecturers alike.
      </div>
    </div> 
    </>
  )
}
