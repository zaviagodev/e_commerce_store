import { SfButton } from "@storefront-ui/react";
import { Icons } from "../components/icons";

export default function NotFound(){
    return (
        <main className="p-[72px] flex flex-col items-center text-center">
            <div className="flex flex-col gap-y-4 items-center">
                <Icons.faceFrown />

                <h1 className="text-9xl font-semibold">404</h1>
                <p className="text-secgray">Not Found Page</p>
            </div>

            <div className="mt-[60px] flex flex-col gap-y-6 items-center">
                <h2 className="text-secgray font-semibold text-lg">ไม่พบหน้าหน้าที่คุณตามหาในขณะนี้</h2>
                <SfButton variant='tertiary' className="btn-primary w-3/4 h-[50px] rounded-xl">
                    กลับไปหน้าหลัก
                </SfButton>
            </div>
        </main>
    )
}