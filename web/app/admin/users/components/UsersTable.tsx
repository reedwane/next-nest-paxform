import { Mail, Trash2, Users, Eye, Shield } from "lucide-react";
import type { User } from "@/types";

interface UsersTableProps {
  users: User[];
  currentUserId?: string;
  onDelete: (id: string) => void;
  onView: (user: User) => void;
}

export default function UsersTable({
  users,
  currentUserId,
  onDelete,
  onView,
}: UsersTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (users.length === 0) {
    return (
      <div className="p-12 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No users yet</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-primary-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onView(user)}
                className="hover:bg-primary-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-primary-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {user.email}
                    </span>
                    {user.id === currentUserId && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(user);
                      }}
                      className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.id);
                      }}
                      disabled={user.id === currentUserId}
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List View */}
      <div className="md:hidden divide-y divide-gray-200">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => onView(user)}
            className="p-4 hover:bg-primary-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="w-4 h-4 text-primary-500" />
                  <h3 className="font-medium text-gray-900">{user.email}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </span>
                  {user.id === currentUserId && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-primary-100 text-primary-700">
                      You
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              Created: {formatDate(user.createdAt)}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(user);
                }}
                className="flex-1 text-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(user.id);
                }}
                disabled={user.id === currentUserId}
                className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
