export const AddressCard = (props) => {
    return (
        <div className="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap">
            <div
                key={props.title}
                className="p-3 w-full min-w-[320px] md:max-w-[450px] lg:w-[380px] relative border border-neutral-200 rounded-md hover:shadow-xl"
            >
                <div className="flex flex-col items-start p-4 grow">
                    {
                        Object.keys(props).map((key, idx) => idx === 0 ?
                            (<p key={key} className="my-1 font-medium typography-text-base">{props[key]}</p>) :
                            (
                                <p key={key} className="font-normal typography-text-sm text-neutral-700">{props[key]}</p>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AddressCard