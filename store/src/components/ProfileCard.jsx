import React from 'react'
import { SfButton, SfIconEmail, SfIconCall, SfIconStar } from '@storefront-ui/react';
import { useUser } from '../hooks/useUser';
import { useFrappeAuth } from 'frappe-react-sdk';
import { Link } from 'react-router-dom';

const ProfileCard = ({
    title = "Selena Gomez",
    loyaltyPoints = "0",
    image = "https://storage.googleapis.com/sfui_docs_artifacts_bucket_public/production/men_category.png",
}) => {
    const { user, logout } = useUser()
    const { currentUser } = useFrappeAuth()
    return (
        <div className="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap">
            <div
                className="p-3 flex min-w-[325px] max-w-[450px] lg:w-[600px] relative border border-neutral-200 rounded-md hover:shadow-xl"
            >
                <img
                    className="rounded-full bg-neutral-100 group-hover:shadow-xl group-active:shadow-none"
                    src={image}
                    width="140"
                    height="140"
                />
                <div className="flex flex-col items-start p-4 grow">
                    <p className="font-medium typography-text-base">{user?.name}</p>
                    <p className="mt-1 font-normal typography-text-sm text-neutral-700"><SfIconEmail size='sm' /> {currentUser}</p>
                    {user?.mobile_no && <p className="font-normal typography-text-sm text-neutral-700"><SfIconCall size='sm' /> {user.mobile_no}</p>}
                    <p className="font-normal typography-text-sm text-neutral-700"><SfIconStar size='sm' />{user?.loyalty_program_tier} (<Link className='text-blue-500' to="/loyality-program">{user?.loyalty_points}</Link>)</p>
                </div>
                <SfButton className="absolute bottom-0 right-0 m-3" onClick={logout}>Logout</SfButton>
            </div>
        </div>
    )
}

export default ProfileCard