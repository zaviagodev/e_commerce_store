import { Icons } from "./icons"
export const AddressCard = (props) => {
    return (
        <div className="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap">
            <div
                key={props.title}
                className={`w-full relative border border-neutral-100 rounded-xl hover:shadow-custom overflow-hidden bg-neutral-50`}
            >
                <div className="flex flex-col items-start p-6 grow">
                        {Object.keys(props).map((key, idx) => idx === 0 ? (
                            <div className="flex items-center justify-between mb-6 w-full" key={key}>
                                <div className="flex items-center gap-x-2">
                                    <Icons.marketPin04 color='#666666' className='min-w-6'/>
                                    <p className="font-semibold text-base">{props[key]}</p>
                                </div>
                                {props.deletebtn === "false" ? null : <button onClick={props.onDelete}>Delete</button>}
                            </div>
                        ) : (
                            <p key={key} className="font-normal text-sm text-neutral-700">{props[key]}</p>
                        ))}
                    </div>

                {props.active ? <div className='h-[9px] w-full post-gradient'/> : null}
            </div>
        </div>
    )
}

export default AddressCard