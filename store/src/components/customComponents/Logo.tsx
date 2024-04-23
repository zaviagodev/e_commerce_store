import { useConfig } from "@/hooks/useConfig"
import { getFileURL } from "@/lib/utils"

const Logo = () => {
  const { config } = useConfig()

  return (
    <>
      {config?.brand_logo ? (
        <img
          src={getFileURL(config?.brand_logo) ?? ""}
          alt={config?.company}
          className="md:min-h-[40px] md:h-[40px] w-auto min-h-[30px] h-[30px]"
        />
      ) : (
        <h2>{config?.company}</h2>
      )}
    </>
  )
}

export default Logo