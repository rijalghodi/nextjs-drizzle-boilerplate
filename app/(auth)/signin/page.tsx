import { Suspense } from "react";
import { SigninForm } from "./components/signin-form";

export default function Page() {
  return (
    <Suspense>
      <SigninForm />
    </Suspense>
  );
}
