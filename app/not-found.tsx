import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4">
      <div className="relative w-full max-w-sm aspect-4/3 mb-8">
        <Image
          src="/illustration/404.svg"
          alt="Halaman Tidak Ditemukan"
          fill
          className="object-contain dark:hidden"
          priority
        />
        <Image
          src="/illustration/404-dark.svg"
          alt="Halaman Tidak Ditemukan"
          fill
          className="object-contain hidden dark:block"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Mohon maaf, halaman yang Anda cari tidak dapat ditemukan atau mungkin telah dipindahkan.
      </p>
      <Button asChild size="lg">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
