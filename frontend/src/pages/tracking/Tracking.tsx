import { useAuth } from "@/auth/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, MapPin, Package } from "@phosphor-icons/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const shipmentSchema = z.object({
  shipmentNumber: z
    .string()
    .min(1, "El número de guía es requerido")
    .max(255, "El número de guía no puede exceder los 255 caracteres"),
});

export type TrackingFormValues = z.infer<typeof shipmentSchema>;

interface TrackingResult {
  shipmentNumber: string;
  status: string;
  currentLocation: string;
  history: Array<{
    timestamp: string;
    status: string;
    location: string;
    notes: string | null;
  }>;
}

export default function Tracking() {
  const { logout } = useAuth();

  const [result, setResult] = useState<TrackingResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackingFormValues>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: { shipmentNumber: "" },
  });

  const onSubmit = async (values: TrackingFormValues) => {
    setSubmitError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/shipments?number=${values.shipmentNumber}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "No se encontró el paquete");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error al consultar");
      setResult(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      entregado: "bg-green-500",
      en_transito: "bg-blue-500",
      detenido_en_aduana: "bg-red-500",
    };
    return variants[status] || "bg-gray-500";
  };

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto flex flex-col max-w-5xl items-center justify-between">
        <div className="max-w-3xl mx-auto p-6 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Rastreo de Paquetes</CardTitle>
              <CardDescription>
                Consulte el estado de su envío en tiempo real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-8 flex flex-col gap-4"
                noValidate
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="shipmentNumber" className="sr-only">
                    Número de Guía
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="shipmentNumber"
                      placeholder="GT-000001"
                      aria-invalid={!!errors.shipmentNumber}
                      className="h-10"
                      {...register("shipmentNumber")}
                    />
                    <Button
                      type="submit"
                      className="h-10"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Buscando..." : "Consultar"}
                    </Button>
                  </div>
                  {errors.shipmentNumber && (
                    <p className="text-xs text-destructive">
                      {errors.shipmentNumber.message}
                    </p>
                  )}
                </div>

                {submitError && (
                  <p className="text-xs text-destructive" role="alert">
                    {submitError}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Estado Actual</CardDescription>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      <Badge className={getStatusBadge(result.status)}>
                        {result.status.replace(/_/g, " ").toUpperCase()}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardDescription>Ubicación Actual</CardDescription>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      {result.currentLocation}
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Historial de Ruta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
                    {result.history.map((item, index) => (
                      <div key={index} className="relative pl-8">
                        <div className="absolute -left-[9px] mt-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary" />
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm font-medium text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                          <div className="font-semibold">
                            {item.status.replace(/_/g, " ").toUpperCase()}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {item.location}
                          </div>
                          {item.notes && (
                            <p className="mt-1 text-sm italic text-muted-foreground p-2 bg-muted/30 rounded">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={logout}>
          Sign out
        </Button>
      </div>
    </main>
  );
}
