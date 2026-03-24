"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner";
import * as z from "zod"

const formSchema = z.object({
  password: z.string().min(8, "Minimum length is 8"),
  email: z.email()
})

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {

  const handleGoogleLogin = async () => {
    const data = authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:3000"
    })
  }

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Logging in")
      try {
        const response = await authClient.signIn.email(value)
        // console.log(response);
        // if (error) {
        //   toast.error(error.message, { id: toastId })
        //   return;
        // }
        toast.success("User Logged in Successfully", { id: toastId })
      } catch (error) {
        toast.error("Something went wrong, please try again", { id: toastId })
      }
    }
  });
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}>
          <FieldGroup>            
            <form.Field name="email" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    type="email"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></Input>
                  {
                    isInvalid && (
                      <FieldError errors={field.state.meta.errors}></FieldError>
                    )
                  }

                </Field>
              )
            }}></form.Field>
            <form.Field name="password" children={(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    type="password"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  ></Input>
                  {
                    isInvalid && (
                      <FieldError errors={field.state.meta.errors}></FieldError>
                    )
                  }
                </Field>
              )
            }}></form.Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Button form="register-form" type="submit">Login</Button>
        <Button onClick={() => handleGoogleLogin()} variant="outline" type="button">
          Login with Google
        </Button>
      </CardFooter>
    </Card >
  )
}
