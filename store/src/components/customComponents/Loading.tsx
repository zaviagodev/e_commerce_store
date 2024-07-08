const Loading = () => {
  return (
    <div className="inline-flex gap-x-2">
      <div className="w-4 h-4 rounded-full bg-darkgray-300 loading-anim opacity-0"/>
      <div className="w-4 h-4 rounded-full bg-darkgray-300 loading-anim opacity-0 !delay-100"/>
      <div className="w-4 h-4 rounded-full bg-darkgray-300 loading-anim opacity-0 !delay-200"/>
    </div>
  )
}

export default Loading