import React, { useState } from 'react'
import MyAccountSection from '../components/MyAccountSection'
import MyAccountForm from '../components/forms/MyAccountForm'

const Profile = () => {
  return (
    <MyAccountSection>
      <h1 className='font-medium text-baselg text-darkgray'>รายละเอียดบัญชี</h1>
      <MyAccountForm />
    </MyAccountSection>
  )
}

export default Profile