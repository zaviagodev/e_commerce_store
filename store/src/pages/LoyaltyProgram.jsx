import React from 'react'
import { useFrappeGetCall } from 'frappe-react-sdk';

const LoyaltyProgram = () => {
    const { data } = useFrappeGetCall('headless_e_commerce.api.get_loyalty_points_details')
    return (
        <div className="px-4 m-3 md:px-6 md:shadow-lg md:rounded-md md:border md:border-neutral-100">
            <p className="text-2xl my-3 font-bold">Points History</p>
            <p className="typography-text-base font-medium">Remaining points: {data?.message.loyalty_points}</p>
            {
                (data?.message.record ?? []).map((record, index) => {
                    return (
                        <div className="flex justify-between typography-text-base py-4" key={index}>
                            <div className="flex flex-col grow pr-2">
                                <p>{record.invoice}</p>
                            </div>
                            <div className="flex flex-col text-right">
                                <p>{record.loyalty_points}</p>
                            </div>
                        </div>
                    )
                })
            }
        </div>

    )
}

export default LoyaltyProgram

