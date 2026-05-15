import Image, { type ImageProps } from "next/image";

type ThemeImageProps = Omit<ImageProps, "src"> & {
  light: string;
  dark: string;
};

export function ThemeImage({ light, dark, alt, className, ...rest }: ThemeImageProps) {
  const lightClass = ["theme-light-only", className].filter(Boolean).join(" ");
  const darkClass = ["theme-dark-only", className].filter(Boolean).join(" ");
  return (
    <>
      <Image src={light} alt={alt} className={lightClass} {...rest} />
      <Image src={dark} alt={alt} className={darkClass} {...rest} />
    </>
  );
}
