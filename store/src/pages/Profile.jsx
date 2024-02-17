import React, { useState } from 'react'
import MyAccountSection from '../components/MyAccountSection'
import MyAccountForm from '../components/forms/MyAccountForm'
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { phone } = useParams();
  return (
    <MyAccountSection phone={phone}>
      <h1 className='font-semibold text-darkgray'>รายละเอียดบัญชี</h1>
      <MyAccountForm />
    </MyAccountSection>
  )
}

export default Profile