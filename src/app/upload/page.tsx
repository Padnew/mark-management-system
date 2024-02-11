"use client";
import React, { useState, useContext, useEffect } from 'react'
import PageHeader from '../_components/shared/PageHeader'
import DropzoneComponent from '../_components/upload/DropzoneComponent';
import UserContext from '../context/UserContext';
import { ClassType } from '../types';

export default function Page() {
  const userContext = useContext(UserContext);
  const [classes, setClasses] = useState<ClassType[]>([])
  useEffect(() => {
    const fetchClasses = async () => {
      const userId = user?.user_id
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classesByUser/${userId}`)
      if (!res.ok) {
        throw new Error('Failed to fetch classes');
      }
      const data = await res.json();
      setClasses(data)
    };
    fetchClasses()
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!userContext) {
    return <div>Loading</div>; 
  }
  const { user } = userContext;

  return (
    <>
    <PageHeader heading={'Upload'} subHeading={'Upload student marks'}/>
    <DropzoneComponent classes={classes}/>
    </>
    )
}
