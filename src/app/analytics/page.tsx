import { Metadata } from 'next'
import React from 'react'
import PageHeader from '../_components/PageHeader'

export const metadata: Metadata = {
    title: 'Analytics',
    description: 'Mark management system for distributed examiniation decisions',
}
export default function page() {
  return (
    <>
    <PageHeader heading={'Analytics'} subHeading={'Insights into student performance'}/>
    </>
  )
}
