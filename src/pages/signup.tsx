import SignUpForm from "~/components/SignupForm";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

export default function SignupPage() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  if (sessionData) {
    router.push("/");
  }
  return <SignUpForm />;
}
