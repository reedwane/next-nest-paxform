"use client";

import { useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import AppointmentsTable from "./components/AppointmentsTable";
import AppointmentDetailModal from "./components/AppointmentDetailModal";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import Pagination from "@/components/Pagination";
import { useAppointments, useDeleteAppointment } from "@/hooks/useAppointments";
import type { Appointment } from "@/types";

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const { data, isLoading, error } = useAppointments(currentPage, 10);
  const deleteAppointment = useDeleteAppointment();

  const appointments = data?.data || [];
  const total = data?.meta.total || 0;
  const totalPages = data?.meta.totalPages || 1;

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;

    try {
      await deleteAppointment.mutateAsync(id);
    } catch (err) {
      alert("Failed to delete appointment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              All Appointments
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {total} appointment{total !== 1 ? "s" : ""}
            </p>
          </div>

          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message="Failed to load appointments" />
          ) : (
            <>
              <AppointmentsTable
                appointments={appointments}
                onDelete={handleDelete}
                onView={setSelectedAppointment}
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

      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}
