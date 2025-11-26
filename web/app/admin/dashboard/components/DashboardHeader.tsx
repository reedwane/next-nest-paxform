import { useRouter } from "next/navigation";
import { LogOut, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm border-b-2 border-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary-700">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={() => router.push("/admin/users")}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Manage Users</span>
              <span className="sm:hidden">Users</span>
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
