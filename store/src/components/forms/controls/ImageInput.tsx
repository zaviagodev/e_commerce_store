import { ImagePlus, X } from "@untitled-ui/icons-react";
import { useTranslate } from "@refinedev/core";

type ImageInputProps = {
  name: string;
  value?: File | FileList;
  onChange: (event: FileList | null) => void;
  onRemove: (event: any) => void;
};

const ImageInput = ({ name, value, onChange, onRemove }: ImageInputProps) => {
  const t = useTranslate();

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        id={name}
        onChange={(e) => onChange(e.target.files)}
      />

      {/* This is the custom input, and it will be shown if the image has not been uploaded */}
      {value ? (
        <label
          className="relative cursor-pointer flex items-center gap-x-3 py-8 px-4 gap-y-3 border border-darkgray-100 bg-accent rounded-xl"
          htmlFor={name}
        >
          <img
            src={URL.createObjectURL(value as File)}
            className="w-16 h-16 object-cover"
          />
          <div>
            <h2 className="font-semibold text-sm">{(value as File)?.name}</h2>
          </div>

          <X
            className="absolute top-6 right-4"
            onClick={(e) => {
              e.preventDefault();
              onRemove(e);
            }}
          />
        </label>
      ) : (
        <label
          className="cursor-pointer flex flex-col p-8 gap-y-3 items-center border border-darkgray-100 bg-accent rounded-xl"
          htmlFor={name}
        >
          <ImagePlus />
          <div className="flex flex-col items-center">
            <h2 className="font-semibold text-lg">{t("Upload Slip")}</h2>
            <p className="text-muted-foreground text-sm">
              {t("PNG or JPG (max. 800x400px)")}
            </p>
          </div>
        </label>
      )}
    </>
  );
};

export default ImageInput;
