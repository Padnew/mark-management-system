"use client";
import React, { useState } from 'react'
import PageHeader from '../_components/shared/PageHeader'
import DropzoneComponent from '../_components/upload/DropzoneComponent';

export default function Page() {
  return (
    <>
    <PageHeader heading={'Upload'} subHeading={'Upload student marks'}/>
    <DropzoneComponent/>
    </>
    )
}
