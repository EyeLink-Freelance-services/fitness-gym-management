import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="/images/logo/fcm_logo.png"
      fill
      alt="FCM Logo"
      role="presentation"
      quality={100}
    />
  );
}
