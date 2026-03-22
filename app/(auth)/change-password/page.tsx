import { Suspense } from "react";
import { ChangePasswordForm } from "./components/change-password-form";

export default function Page() {
  return (
    <Suspense>
      <ChangePasswordForm />
    </Suspense>
  );
}
