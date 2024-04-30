import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col gap-y-10 items-center text-center">
      <div className="flex flex-col">
        <h1 className="text-[100px] leading-[120px] font-semibold">404</h1>
        <p className="text-darkgray-200">Not Found Page</p>
      </div>

      <div className="flex flex-col gap-y-4 w-full">
        <p className="text-darkgray-200 font-semibold">ไม่พบหน้าหน้าที่คุณตามหาในขณะนี้</p>
        <Link to="/" className="w-[260px] mx-auto">
          <Button className="main-btn">
            กลับไปหน้าหลัก
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound