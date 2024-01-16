import classNames from 'classnames'

function Skeleton({ className, ...props }) {
  return (
    <div
      className={classNames("animate-pulse rounded-md bg-gray-100", className)}
      {...props}
    />
  )
}
  
export { Skeleton }