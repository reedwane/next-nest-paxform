"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers, useCreateUser, useDeleteUser } from "@/hooks/useUsers";
import type { CreateUserRequest, User } from "@/types";
import UsersHeader from "./components/UsersHeader";
import CreateUserForm from "./components/CreateUserForm";
import UsersTable from "./components/UsersTable";
import UserDetailModal from "./components/UserDetailModal";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import Pagination from "@/components/Pagination";

export default function UsersPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();
  const { data, isLoading, error } = useUsers(currentPage, 10);
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const users = data?.data || [];
  const total = data?.meta.total || 0;
  const totalPages = data?.meta.totalPages || 1;

  const handleCreateUser = async (data: CreateUserRequest) => {
    try {
      await createUser.mutateAsync(data);
      setShowCreateForm(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUser?.id) {
      alert("You cannot delete your own account");
      return;
    }

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser.mutateAsync(id);
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UsersHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CreateUserForm
          onSubmit={handleCreateUser}
          isSubmitting={createUser.isPending}
          showForm={showCreateForm}
          onToggle={() => setShowCreateForm(!showCreateForm)}
        />

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Users</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {total} user{total !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message="Failed to load users" />
          ) : (
            <>
              <UsersTable
                users={users}
                currentUserId={currentUser?.id}
                onDelete={handleDelete}
                onView={setSelectedUser}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </main>

      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}
