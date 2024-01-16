import React, { useState } from 'react'
import MyAccountSection from '../components/MyAccountSection'
import MyAccountForm from '../components/forms/MyAccountForm'

const Profile = () => {
    const [randomKey, setrandomKey] = useState(0)
    return (
      <MyAccountSection>
        <h1 className='mb-10 primary-heading text-center text-primary'>Account Details</h1>
        <section className='w-3/4 mx-auto'>
          <MyAccountForm />
        </section>
      </MyAccountSection>
    )
}

export default Profile