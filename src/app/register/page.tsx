"use client";

import dynamic from "next/dynamic";

const RegPage = dynamic(() => import("@/components/pages/RegPage"), {
  ssr: false,
});

export default function RegisterPage() {
  return <RegPage />;
}
