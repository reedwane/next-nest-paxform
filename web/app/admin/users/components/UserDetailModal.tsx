"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import { useUpdateUser } from "@/hooks/useUsers";
import type { User, CreateUserRequest } from "@/types";

interface UserDetailModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({
  user,
  isOpen,
  onClose,
}: UserDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateUser = useUpdateUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<CreateUserRequest>>();

  if (!user) return null;

  const onSubmit = async (data: Partial<CreateUserRequest>) => {
    try {
      // Only send fields that have values
      const updateData: Partial<CreateUserRequest> = {};
      if (data.email) updateData.email = data.email;
      if (data.password) updateData.password = data.password;
      if (data.isAdmin !== undefined) updateData.isAdmin = data.isAdmin;

      await updateUser.mutateAsync({ id: user.id, data: updateData });
      setIsEditing(false);
      reset();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="User Details">
      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="mt-1">
              <span
                className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                  user.isAdmin
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {user.isAdmin ? "Admin" : "User"}
              </span>
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Created At
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(user.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Updated At
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(user.updatedAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Edit User
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue={user.email}
              {...register("email", {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password (leave blank to keep current)
            </label>
            <input
              type="password"
              {...register("password", {
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAdmin"
              defaultChecked={user.isAdmin}
              {...register("isAdmin")}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label
              htmlFor="isAdmin"
              className="text-sm font-medium text-gray-700"
            >
              Admin User
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateUser.isPending}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {updateUser.isPending ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                reset();
              }}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
