import { Metadata } from 'next'
import React from 'react'
import PageHeader from '../components/PageHeader'
import { FaAmazon } from 'react-icons/fa'

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
