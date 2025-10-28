import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { apiClient, type Client } from "../lib/api";
import { Users, Activity, DollarSign } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadClients();
    loadStats();
  }, []);

  async function loadClients() {
    setLoading(true);
    try {
      const res = await apiClient.getAllClients();
      if (res.success && res.data) {
        setClients(res.data.clients || []);
      }
    } catch (e) {
      setError("Failed to load clients");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const res = await apiClient.getDashboardStats();
      if (res.success && res.data) setStats(res.data.stats || {});
    } catch (e) {
      /* ignore */
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.adminLogout();
      navigate("/admin/login");
    } catch (e) {
      setError("Logout failed");
    }
  };

  return (
    <div className="p-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src="https://dsqvyt2qb7cgs.cloudfront.net/app/uploads/2025/01/wme-og.webp" alt="WME" className="h-10 w-auto object-contain" />
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage clients, bookings, and system settings</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-red-600 text-white text-sm">Logout</button>
        </div>
      </header>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm">Total Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? clients.length}</div>
            <Users className="mt-2 h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm">Active Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active ?? 0}</div>
            <Activity className="mt-2 h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl">
          <CardHeader>
            <CardTitle className="text-sm">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.revenue ?? "$0"}</div>
            <DollarSign className="mt-2 h-5 w-5 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-2">Clients</h2>
        <div className="space-y-2">
          {clients.map((c) => (
            <div key={c.bookingId} className="p-3 border rounded-lg bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.bookingId} • {c.artist}</div>
                </div>
                <div className="text-sm text-muted-foreground">{c.status}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-6">
        <button className="px-4 py-2 bg-red-600 text-white rounded" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
