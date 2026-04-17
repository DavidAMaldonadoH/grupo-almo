import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

import { loginSchema, type LoginFormValues } from "@/auth/schemas";
import { useAuth } from "@/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LocationState = { from?: { pathname?: string } };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setSubmitError(null);
    try {
      await login(
        { email: values.email, password: values.password },
        values.rememberMe,
      );
      const redirectTo =
        (location.state as LocationState | null)?.from?.pathname ?? "/tracking";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Error al iniciar sesión",
      );
    }
  };

  return (
    <main className="h-screen bg-background p-4 md:p-8">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-1 overflow-hidden rounded-lg ring-1 ring-foreground/10 md:grid-cols-2">
        <section className="flex min-h-0 flex-col justify-between overflow-y-auto bg-card p-6 md:px-8 md:py-7">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="" className="size-6" />
            <span className="font-heading text-sm font-medium">Grupo Almo</span>
          </div>

          <div className="mx-auto w-full max-w-sm">
            <h1 className="font-heading text-2xl font-semibold leading-tight md:text-3xl">
              Bienvenido
              <br />
              de nuevo
            </h1>
            <p className="mt-3 text-xs text-muted-foreground">
              Accede a tu cuenta para gestionar y rastrear tus paquetes.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col gap-4"
              noValidate
            >
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="grupo@almo.com"
                  aria-invalid={!!errors.email}
                  className="h-10"
                  {...register("email")}
                />
                {errors.email ? (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="password" className="sr-only">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  aria-invalid={!!errors.password}
                  className="h-10"
                  {...register("password")}
                />
                {errors.password ? (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="rememberMe"
                  className="cursor-pointer text-xs font-normal text-muted-foreground"
                >
                  <Controller
                    control={control}
                    name="rememberMe"
                    render={({ field }) => (
                      <Checkbox
                        id="rememberMe"
                        checked={!!field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                  Recuérdame
                </Label>
                <a
                  href="#"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {submitError ? (
                <p className="text-xs text-destructive" role="alert">
                  {submitError}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="mt-2 h-11 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </div>

          <p className="text-xs text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </section>

        <aside className="hidden min-h-0 items-center justify-center bg-primary/10 md:flex">
          <img
            src="/login-image.jpg"
            alt="Welcome illustration"
            className="h-full w-full object-cover"
          />
        </aside>
      </div>
    </main>
  );
}
