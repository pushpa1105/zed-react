import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { RegisterFormSchema } from "@/schemas";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { RegisterFormType } from "@/types";
import { withAsyncHandler } from "@/utils/withAsyncHandler";
import { register } from "@/services";
import { toast } from "sonner";

const RegisterPage = () => {
    const navigate = useNavigate()

    const signIn = async (data: RegisterFormType) => {
        await withAsyncHandler(
            () => register(data),
            {
                onSuccess: (res) => {
                    toast.success(res?.data?.message)
                    navigate('/login')
                }
            }
        )
    }

    const registerFormInstance = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        validators: {
            onSubmit: RegisterFormSchema
        },
        onSubmit: ({ value }) => signIn(value),
        formId: 'registerForm',
    })

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn')

        if (isLoggedIn) navigate('/')
    }, [navigate])
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="">
                    <CardHeader>
                        <CardTitle>Create an account</CardTitle>
                        <CardDescription>
                            Enter your information below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            id="registerForm"
                            onSubmit={(e) => {
                                e.preventDefault()
                                registerFormInstance.handleSubmit()
                            }}
                        >
                            <FieldGroup>
                                <registerFormInstance.Field
                                    name="name"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="Your Full Name"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                                <registerFormInstance.Field
                                    name="email"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="Your email address"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                                <registerFormInstance.Field
                                    name="password"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    type="password"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="***********"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />

                                <registerFormInstance.Field
                                    name="confirmPassword"
                                    children={(field) => {
                                        const isInvalid =
                                            field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                            <Field data-invalid={isInvalid}>
                                                <FieldLabel htmlFor={field.name}>Re-Enter Password</FieldLabel>
                                                <Input
                                                    id={field.name}
                                                    name={field.name}
                                                    value={field.state.value}
                                                    type="password"
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    aria-invalid={isInvalid}
                                                    placeholder="***********"
                                                    autoComplete="off"
                                                />
                                                {isInvalid && (
                                                    <FieldError errors={field.state.meta.errors} />
                                                )}
                                            </Field>
                                        )
                                    }}
                                />
                            </FieldGroup>
                        </form>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full" form="registerForm">
                            Register
                        </Button>
                        <div className="text-muted-foreground text-sm">
                            Already have an account?
                            <Link to={"/login"} className="ms-2 underline">Sign In</Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default RegisterPage;
