import React from 'react'
import { useSearchParams } from 'react-router-dom';
const BankInfoPage = () => {
    const [searchParams] = useSearchParams();

    const data = [
      { title:'Order ID', info:searchParams.get("order_id")},
      { title:'Date', info:''},
      { title:'Total', info:`฿${searchParams.get("amount")}`}
    ]

    return (
        <div className='p-4 h-screen w-screen flex flex-col  justify-center items-center bg-primary-100'>
            <div>
                <h1 className='text-3xl'>Thank you for your order: {searchParams.get("order_id")}</h1>
                <h3 className='text-xl'>Please transfer money to the following bank account:</h3>
                <h5 className='text-xl'>Bank: SCB</h5>
                <h5 className='text-xl'>Account Number: 123456789</h5>
                <h5 className='text-xl'>Account Name: John Doe</h5>
                <h5 className='text-xl'>Amount: ฿ {searchParams.get("amount")}</h5>
                {data.map(d => (
                    <div className='flex items-center justify-between'>
                        <h2>{d.title}</h2>
                        <p>{d.info}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BankInfoPage