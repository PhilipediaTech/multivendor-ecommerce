"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [applications, setApplications] = useState([]);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [applicationStatus, setApplicationStatus] = useState("pending");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      if (activeTab === "applications") {
        fetchApplications();
      } else {
        fetchUsers();
      }
    }
  }, [status, session, activeTab, applicationStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const roleParam = activeTab !== "all" ? `?role=${activeTab}` : "";
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

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/vendor-applications?status=${applicationStatus}`
      );
      const data = await response.json();

      if (data.success) {
        setApplications(data.applications);
      }

      // Always fetch pending count for badge
      const pendingResponse = await fetch(
        "/api/admin/vendor-applications?status=pending"
      );
      const pendingData = await pendingResponse.json();
      if (pendingData.success) {
        setPendingApplicationsCount(pendingData.applications.length);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (
    userId,
    action,
    rejectionReason = ""
  ) => {
    if (!confirm(`Are you sure you want to ${action} this application?`)) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`/api/admin/vendor-applications/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        fetchApplications();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error processing application:", error);
      alert("Failed to process application");
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewUser = async (userId) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`);
      const data = await response.json();

      if (data.success) {
        setSelectedUser(data.user);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!confirm(`Change user role to ${newRole}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (data.success) {
        alert("User role updated successfully");
        setShowModal(false);
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("Failed to update user role");
    }
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
        setShowModal(false);
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  const filteredUsers = users.filter((user) => {
    if (activeTab === "all") return true;
    return user.role === activeTab;
  });

  if (status === "loading" || !session || session.user.role !== "admin") {
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
              <div className="flex gap-4">
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="text-primary-600 font-medium border-b-2 border-primary-600 pb-4"
                >
                  Users
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-gray-700 hover:text-gray-900 font-medium"
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage all platform users</p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "all"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab("customer")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "customer"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("vendor")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "vendor"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Vendors
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "admin"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "applications"
                ? "bg-primary-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Applications
            {pendingApplicationsCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {pendingApplicationsCount}
              </span>
            )}
          </button>
        </div>

        {/* Users Table */}
        {activeTab !== "applications" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
              </div>
            ) : (
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id}>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
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
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewUser(user._id)}
                            className="text-primary-600 hover:text-primary-900 font-medium mr-4"
                          >
                            View
                          </button>
                          {user._id !== session.user.id && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900 font-medium"
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
            )}
          </div>
        )}

        {/* Vendor Applications View */}
        {activeTab === "applications" && (
          <>
            {/* Application Status Filter */}
            <div className="mb-4 flex gap-2 flex-wrap">
              <button
                onClick={() => setApplicationStatus("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  applicationStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setApplicationStatus("approved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  applicationStatus === "approved"
                    ? "bg-green-100 text-green-800 border-2 border-green-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setApplicationStatus("rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  applicationStatus === "rejected"
                    ? "bg-red-100 text-red-800 border-2 border-red-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected
              </button>
              <button
                onClick={() => setApplicationStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  applicationStatus === "all"
                    ? "bg-blue-100 text-blue-800 border-2 border-blue-300"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-8 text-center text-gray-500"
                        >
                          No{" "}
                          {applicationStatus !== "all" ? applicationStatus : ""}{" "}
                          applications found
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-semibold">
                                  {app.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {app.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {app.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {app.vendorInfo?.shopName || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {app.vendorInfo?.shopDescription ||
                                "No description"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              app.vendorInfo?.appliedAt || app.createdAt
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                app.vendorInfo?.applicationStatus === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : app.vendorInfo?.applicationStatus ===
                                    "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {app.vendorInfo?.applicationStatus || "pending"}
                            </span>
                            {app.vendorInfo?.applicationStatus === "rejected" &&
                              app.vendorInfo?.rejectionReason && (
                                <div className="text-xs text-red-600 mt-1">
                                  {app.vendorInfo.rejectionReason}
                                </div>
                              )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {app.vendorInfo?.applicationStatus === "pending" ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleApplicationAction(app._id, "approve")
                                  }
                                  disabled={actionLoading}
                                  className="text-green-600 hover:text-green-900 font-medium disabled:opacity-50"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() => {
                                    const reason = prompt(
                                      "Enter rejection reason (required):"
                                    );
                                    if (reason && reason.trim()) {
                                      handleApplicationAction(
                                        app._id,
                                        "reject",
                                        reason.trim()
                                      );
                                    } else if (reason !== null) {
                                      alert("Rejection reason is required");
                                    }
                                  }}
                                  disabled={actionLoading}
                                  className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                                >
                                  ✗ Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400">
                                {app.vendorInfo?.applicationStatus ===
                                "approved"
                                  ? "✓ Approved"
                                  : "✗ Rejected"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedUser.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Current Role
                  </label>
                  <p className="text-gray-900">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        selectedUser.role === "admin"
                          ? "bg-red-100 text-red-800"
                          : selectedUser.role === "vendor"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedUser.role}
                    </span>
                  </p>
                </div>

                {selectedUser.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedUser.phone}</p>
                  </div>
                )}

                {selectedUser.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">
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
                  <label className="text-sm font-medium text-gray-500">
                    Joined
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-500 mb-3 block">
                    Change Role
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateRole(selectedUser._id, "customer")
                      }
                      disabled={selectedUser.role === "customer"}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Customer
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRole(selectedUser._id, "vendor")
                      }
                      disabled={selectedUser.role === "vendor"}
                      className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg font-medium hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Vendor
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateRole(selectedUser._id, "admin")
                      }
                      disabled={selectedUser.role === "admin"}
                      className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Admin
                    </button>
                  </div>
                </div>

                {selectedUser._id !== session.user.id && (
                  <div className="pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteUser(selectedUser._id)}
                      className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                    >
                      Delete User
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
