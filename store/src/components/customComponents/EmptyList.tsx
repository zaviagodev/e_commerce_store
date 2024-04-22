import { ReactNode } from "react"

type EmptyListProps = {
  icon: ReactNode
  title: string
  desc: string
}

const EmptyList = ({ icon, title, desc } : EmptyListProps) => {
  return (
    <div className="pt-10 flex flex-col items-center text-center gap-y-8 px-10">
      <div className="bg-black w-[53px] h-[53px] flex items-center justify-center rounded-full">
        {icon}
      </div>

      <h1 className="text-2xl font-semibold px-2">{title}</h1>
      <p className="text-darkgray-400">{desc}</p>
    </div>
  )
}

export default EmptyList