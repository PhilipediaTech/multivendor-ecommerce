"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/utils/helpers";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
    if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [status, session, filter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const roleParam = filter !== "all" ? `?role=${filter}` : "";
      const response = await fetch(`/api/admin/users${roleParam}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        alert("User deleted successfully");
        fetchUsers();
      } else {
        alert("Failed to delete user: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user");
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        alert("User role updated successfully");
        fetchUsers();
        setShowModal(false);
      } else {
        alert("Failed to update role: " + data.message);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Error updating role");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading users...</div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold text-primary-600">
                MarketHub
              </Link>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="text-primary-600 font-medium"
                >
                  Users
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-gray-700 hover:text-gray-900"
                >
                  Orders
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Admin
              </span>
              <span className="text-gray-700">{session.user.name}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all platform users</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === "all"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Users ({users.length})
            </button>
            <button
              onClick={() => setFilter("customer")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === "customer"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setFilter("vendor")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === "vendor"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Vendors
            </button>
            <button
              onClick={() => setFilter("admin")}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                filter === "admin"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Admins
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "vendor"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          View
                        </button>
                        {user._id !== session.user.id && (
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  User Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Role
                  </label>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                      selectedUser.role === "admin"
                        ? "bg-red-100 text-red-800"
                        : selectedUser.role === "vendor"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {selectedUser.role}
                  </span>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedUser.phone}</p>
                  </div>
                )}

                {selectedUser.businessName && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name
                    </label>
                    <p className="text-gray-900">{selectedUser.businessName}</p>
                  </div>
                )}

                {selectedUser.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.address.street &&
                        `${selectedUser.address.street}, `}
                      {selectedUser.address.city &&
                        `${selectedUser.address.city}, `}
                      {selectedUser.address.state &&
                        `${selectedUser.address.state} `}
                      {selectedUser.address.zipCode}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Joined
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>

                {selectedUser._id !== session.user.id && (
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Update Role
                    </label>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          handleUpdateRole(selectedUser._id, "customer")
                        }
                        disabled={selectedUser.role === "customer"}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          selectedUser.role === "customer"
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Customer
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateRole(selectedUser._id, "vendor")
                        }
                        disabled={selectedUser.role === "vendor"}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          selectedUser.role === "vendor"
                            ? "bg-purple-100 text-purple-400 cursor-not-allowed"
                            : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        }`}
                      >
                        Vendor
                      </button>
                      <button
                        onClick={() =>
                          handleUpdateRole(selectedUser._id, "admin")
                        }
                        disabled={selectedUser.role === "admin"}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition ${
                          selectedUser.role === "admin"
                            ? "bg-red-100 text-red-400 cursor-not-allowed"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        Admin
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                {selectedUser._id !== session.user.id && (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleDeleteUser(selectedUser._id);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Delete User
                  </button>
                )}
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
