
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { IdCard, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient } from "../lib/api";

export function LoginForm() {
  const [searchParams] = useSearchParams();
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const verifiedBookingId = searchParams.get("bookingId");
    const isImpersonating = searchParams.get("impersonate") === "true";

    if (isImpersonating) {
      const impersonationToken = sessionStorage.getItem("impersonationToken");
      const impersonatedBookingId = searchParams.get("bookingId");
      if (impersonationToken && impersonatedBookingId) {
        handleImpersonatedLogin(impersonatedBookingId, impersonationToken);
      }
    } else if (verified === "true" && verifiedBookingId) {
      setShowSuccess(true);
      setBookingId(verifiedBookingId);
      const timer = setTimeout(() => setShowSuccess(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleImpersonatedLogin = async (
    impersonatedBookingId: string,
    token: string,
  ) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await apiClient.login(impersonatedBookingId, token);
      if (response && response.success) {
        try {
          localStorage.setItem(
            "wme-user-data",
            JSON.stringify((response as any).client),
          );
        } catch (e) {
          /* ignore storage errors */
        }
        window.location.href = "/dashboard";
      } else {
        setError("Impersonation login failed.");
      }
    } catch (err) {
      setError("An error occurred during impersonation login.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateBookingId = (id: string) => {
    const regex = /^[A-Z0-9]{8}$/i;
    return regex.test(id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!bookingId) {
      setError("Please enter your Booking ID");
      return;
    }

    if (!validateBookingId(bookingId)) {
      setError("Booking ID must be 8 alphanumeric characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.login(bookingId);
      if (response && response.success) {
        try {
          localStorage.setItem(
            "wme-user-data",
            JSON.stringify((response as any).client),
          );
        } catch (e) {
          /* ignore storage errors */
        }
        window.location.href = "/dashboard";
      } else {
        setError(response.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
      <div className="w-full max-w-md mx-auto">
        {showSuccess && (
          <Alert variant="default" className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Email Verified</AlertTitle>
            <AlertDescription className="text-green-700">
              Your email was verified successfully. You can now log in.
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Client Access</TabsTrigger>
            <TabsTrigger value="booking">New Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  Secure Client Login
                </CardTitle>
                <CardDescription>
                  Enter your 8-character Booking ID to access your portal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bookingId" className="font-semibold">
                      Booking ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="bookingId"
                        type="text"
                        placeholder="e.g. WME12345"
                        value={bookingId}
                        onChange={(e) => {
                          const value = e.target.value
                            .toUpperCase()
                            .replace(/[^A-Z0-9]/g, "");
                          if (value.length <= 8) {
                            setBookingId(value);
                            setError("");
                          }
                        }}
                        className="h-12 text-base pl-10"
                        maxLength={8}
                        required
                      />
                      <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Login Failed</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      "Access Account"
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-center text-xs text-muted-foreground">
                <p>
                  By logging in, you agree to our{" "}
                  <Link
                    to="/terms"
                    className="text-wme-gold hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-wme-gold hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="booking">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-display text-2xl">
                  New Event Booking
                </CardTitle>
                <CardDescription>
                  This feature is coming soon. Please check back later.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-gray-50/50">
                  Coming Soon
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
