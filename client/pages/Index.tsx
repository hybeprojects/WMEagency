import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Star, Shield, Globe, IdCard, Loader2 } from "lucide-react";
import { apiClient } from "../lib/api";

export default function Index() {
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
    <div className="min-h-screen bg-gradient-to-b from-wme-light-gray to-white">
      <header className="absolute top-0 left-0 right-0 z-20 bg-transparent">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="https://dsqvyt2qb7cgs.cloudfront.net/app/uploads/2025/01/wme-og.webp" alt="WME" className="h-10 w-auto object-contain" />
              <div>
                <h1 className="text-lg font-display tracking-tight">WME</h1>
                <p className="text-xs text-muted-foreground">Client Portal</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <Link to="/terms" className="hover:text-wme-gold">Terms</Link>
              <Link to="/privacy" className="hover:text-wme-gold">Privacy</Link>
              <Link to="/dashboard" className="text-sm px-3 py-1 rounded-md bg-wme-gold text-black font-semibold">Client Login</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center min-h-screen pt-24">
        <div className="w-full max-w-2xl p-6">
          <Card className="shadow-2xl rounded-2xl overflow-hidden">
            <div className="p-8 bg-gradient-to-r from-white via-wme-light-gray to-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-display font-bold">Access Your Client Portal</h2>
                  <p className="text-sm text-muted-foreground mt-1">Secure access to event bookings, invoices and personal details.</p>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                  <Star className="w-6 h-6 text-wme-gold" />
                </div>
              </div>

              {showSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded mb-4">
                  <p className="text-green-700 text-sm">Your email was verified successfully.</p>
                </div>
              )}

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent border-b border-gray-200">
                  <TabsTrigger
                    value="login"
                    className="data-[state=active]:text-wme-gold data-[state=active]:border-b-2 data-[state=active]:border-wme-gold"
                  >
                    Client Access
                  </TabsTrigger>
                  <TabsTrigger
                    value="booking"
                    className="data-[state=active]:text-wme-gold data-[state=active]:border-b-2 data-[state=active]:border-wme-gold"
                  >
                    New Booking
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bookingId" className="text-muted-foreground">Booking ID</Label>
                      <div className="relative">
                        <Input
                          id="bookingId"
                          type="text"
                          placeholder="Enter 8-character Booking ID"
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
                          className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-wme-gold pl-10"
                          maxLength={8}
                          required
                        />
                        <IdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-red-600 text-sm">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-wme-gold text-black hover:bg-wme-gold/90 font-semibold"
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        "Access Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="booking">
                  <div className="text-sm text-muted-foreground">New booking flow coming soon.</div>
                </TabsContent>
              </Tabs>

              <div className="text-center mt-6">
                <p className="text-xs text-muted-foreground">By accessing your account, you agree to our <Link to="/terms" className="text-wme-gold hover:underline">Terms of Service</Link></p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
