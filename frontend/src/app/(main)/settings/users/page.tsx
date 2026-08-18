"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

interface Invite {
  id: string;
  token: string;
  created_by: string;
  used: boolean;
  created_at: string;
}

export default function UsersSettingsPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  async function fetchInvites() {
    try {
      const res = await fetch("/api/invites");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load invites");
        return;
      }
      setInvites(data.invites || []);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInvites();
  }, []);

  async function generateInvite() {
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/invites", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to generate invite");
        return;
      }
      setInvites([...invites, data.invite]);
    } catch (err) {
      setError("Network error generating invite");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error && error.includes("admins can manage invites")) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Users & Invites</h1>
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          Access denied. Only Admins can manage users and invites.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users & Invites</h1>
          <p className="text-gray-500 mt-1">Manage team members and generate invite tokens.</p>
        </div>
        <Button onClick={generateInvite} loading={generating} variant="primary">
          Generate Invite Token
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Token
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invites.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No invite tokens generated yet.
                </td>
              </tr>
            ) : (
              invites.map((invite) => (
                <tr key={invite.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {invite.token}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {invite.used ? (
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                        Used
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invite.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
