
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
import { IdCard, Loader2 } from "lucide-react";
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
    <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-4 mb-8">
          <img
            src="https://dsqvyt2qb7cgs.cloudfront.net/app/uploads/2025/01/wme-og.webp"
            alt="WME"
            className="h-12 w-auto object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold font-display tracking-tight">
              WME Client Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Exclusive access for WME clients.
            </p>
          </div>
        </div>

        {showSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
            <p className="text-green-700 text-sm font-medium">
              Your email was verified successfully.
            </p>
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Client Access</TabsTrigger>
            <TabsTrigger value="booking">New Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="pt-6">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bookingId" className="font-medium">
                  Booking ID
                </Label>
                <div className="relative">
                  <Input
                    id="bookingId"
                    type="text"
                    placeholder="Enter your 8-character Booking ID"
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
                    className="h-12 text-lg pl-10"
                    maxLength={8}
                    required
                  />
                  <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm font-semibold">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-wme-gold text-black hover:bg-wme-gold/90 font-bold text-lg"
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
          </TabsContent>

          <TabsContent value="booking" className="pt-6">
            <div className="text-sm text-center text-muted-foreground p-8 border rounded-lg bg-gray-50">
              New booking flow is coming soon.
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            By accessing your account, you agree to our{" "}
            <Link to="/terms" className="text-wme-gold hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-wme-gold hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
