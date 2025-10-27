import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { apiClient } from "@/lib/api";

export default function AdminSettings() {
  const navigate = useNavigate();
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await apiClient.adminLogout();
    } catch (e) {
      // ignore logout errors
    } finally {
      navigate("/admin/login");
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure administrative options for the WME Client Portal.
        </p>
      </header>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Administrative actions and logout.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Use the button below to sign out of the admin session.
              </p>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Site Settings</CardTitle>
              <CardDescription>
                Basic site settings. Currently editing happens locally in the
                browser.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Title</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    defaultValue={"WME Client Portal"}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Support Email</label>
                  <input
                    className="w-full rounded border px-3 py-2"
                    defaultValue={"support@example.com"}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button onClick={() => { setSaving(true); setTimeout(() => setSaving(false), 700); }} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System</CardTitle>
              <CardDescription>Check system health and admin utilities.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={async () => {
                    setError(null);
                    try {
                      const res = await apiClient.getSystemHealth();
                      if (!res.success) throw new Error(res.error || "Failed to fetch");
                      alert(JSON.stringify(res.data || res, null, 2));
                    } catch (err: any) {
                      setError(err?.message || "Failed to check system health");
                    }
                  }}
                >
                  Check System Health
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
