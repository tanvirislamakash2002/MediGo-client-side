import { LoginForm } from "@/components/modules/authentication/login-form"

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className=" max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
