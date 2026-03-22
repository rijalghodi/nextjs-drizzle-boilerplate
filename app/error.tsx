"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-center p-4 min-h-screen">
      <div className="relative w-full max-w-sm aspect-4/3 mb-8">
        <Image
          src="/illustration/500.svg"
          alt="Kesalahan Sistem"
          fill
          className="object-contain dark:hidden"
          priority
        />
        <Image
          src="/illustration/500-dark.svg"
          alt="Kesalahan Sistem"
          fill
          className="object-contain hidden dark:block"
          priority
        />
      </div>
      <h1 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Mohon maaf, sistem kami sedang mengalami kendala. Silakan coba lagi beberapa saat.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => window.location.reload()} size="lg" variant="outline">
          Coba Lagi
        </Button>
        <Button asChild size="lg">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
