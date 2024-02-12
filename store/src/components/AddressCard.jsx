import Modal from "./drawers/Modal"
import { Icons } from "./icons"
import { useDisclosure, SfButton } from "@storefront-ui/react";
export const AddressCard = (props) => {
    const { close, open:openModal, isOpen } = useDisclosure();
    return (
        <>
            <div className="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap">
                <div
                    key={props.title}
                    className={`w-full relative border border-neutral-100 rounded-xl hover:shadow-custom overflow-hidden bg-neutral-50`}
                >
                    <div className="flex flex-col items-start p-6 grow">
                            {Object.keys(props).map((key, idx) => idx === 0 ? (
                                <div className="flex items-center justify-between mb-5 w-full" key={key}>
                                    <div className="flex items-center gap-x-2">
                                        <Icons.marketPin04 color='#666666' className='min-w-6'/>
                                        <p className="font-semibold text-base">{props[key]}</p>
                                    </div>

                                    {/* move onClick={props.onDelete} to the button of 'ลบที่อยู่', which is on the modal */}

                                    {props.deletebtn === false ? null : <button onClick={openModal}><Icons.trash01 color='#979797' className='w-5 h-5'/></button>}
                                </div>
                            ) : (
                                <p key={key} className="font-normal text-sm text-neutral-700">{props[key]}</p>
                            ))}
                        </div>
                    {props.active ? <div className='h-[9px] w-full post-gradient'/> : null}
                </div>
            </div>

            <Modal close={close} isOpen={isOpen} open={openModal}>
                <div className='flex flex-col gap-y-6'>
                    <h1 className='text-black text-2xl font-semibold'>ต้องการลบที่อยู่</h1>
                    <p className='text-darkgray'>หากลบที่อยู่แล้วจะไม่สามารถเรียกคืนที่อยู่ที่<br/>ลบไปแล้วกลับมาได้อีกครั้ง</p>
                </div>

                <div className='flex gap-x-3 w-full'>
                <SfButton variant='tertiary' className='w-full btn-secondary h-[50px] rounded-xl' onClick={close}>
                    ยกเลิก
                </SfButton>
                <SfButton variant='tertiary' className='w-full btn-primary h-[50px] rounded-xl' onClick={props.onDelete}>
                    ลบที่อยู่
                </SfButton>
                </div>
            </Modal>
        </>
    )
}

export default AddressCard