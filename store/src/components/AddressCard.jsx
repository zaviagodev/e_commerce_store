export const AddressCard = (props) => {
    return (
        <div className="flex flex-wrap gap-4 lg:gap-6 lg:flex-nowrap">
            <div
                key={props.title}
                className="w-full relative border border-neutral-200 rounded-lg hover:shadow-xl"
            >
                <div className="flex flex-col items-start p-3 grow">
                    {
                        Object.keys(props).map((key, idx) => idx === 0 ?
                            (<p key={key} className="font-semibold text-base mb-2">{props[key]}</p>) :
                            (
                                <p key={key} className="font-normal text-sm text-neutral-700">{props[key]}</p>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default AddressCard