"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Modal from "@/components/Modal";
import { useUpdateAppointment } from "@/hooks/useAppointments";
import type { Appointment, CreateAppointmentRequest } from "@/types";

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentDetailModal({
  appointment,
  isOpen,
  onClose,
}: AppointmentDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateAppointment = useUpdateAppointment();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Partial<CreateAppointmentRequest>>();

  if (!appointment) return null;

  const onSubmit = async (data: Partial<CreateAppointmentRequest>) => {
    try {
      // Email cannot be changed, so we exclude it
      const updateData: Partial<CreateAppointmentRequest> = {};
      if (data.name) updateData.name = data.name;
      if (data.appointmentDateTime)
        updateData.appointmentDateTime = data.appointmentDateTime;
      if (data.notes !== undefined) updateData.notes = data.notes;

      await updateAppointment.mutateAsync({
        id: appointment.id,
        data: updateData,
      });
      setIsEditing(false);
      reset();
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update appointment");
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Appointment Details">
      {!isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="mt-1 text-gray-900">{appointment.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="mt-1 text-gray-900">{appointment.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">
              Appointment Date & Time
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(appointment.appointmentDateTime).toLocaleString()}
            </p>
          </div>

          {appointment.notes && (
            <div>
              <label className="text-sm font-medium text-gray-500">Notes</label>
              <p className="mt-1 text-gray-900">{appointment.notes}</p>
            </div>
          )}

          {appointment.googleEventId && (
            <div>
              <label className="text-sm font-medium text-gray-500">
                Google Calendar
              </label>
              <p className="mt-1">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded bg-primary-100 text-primary-700">
                  Synced
                </span>
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">
              Created At
            </label>
            <p className="mt-1 text-gray-900">
              {new Date(appointment.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Edit Appointment
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
              Name
            </label>
            <input
              type="text"
              defaultValue={appointment.name}
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (cannot be changed)
            </label>
            <input
              type="email"
              value={appointment.email}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date & Time
            </label>
            <input
              type="datetime-local"
              defaultValue={new Date(appointment.appointmentDateTime)
                .toISOString()
                .slice(0, 16)}
              {...register("appointmentDateTime", {
                required: "Date and time is required",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {errors.appointmentDateTime && (
              <p className="text-red-500 text-sm mt-1">
                {errors.appointmentDateTime.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              defaultValue={appointment.notes || ""}
              {...register("notes")}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={updateAppointment.isPending}
              className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {updateAppointment.isPending ? "Saving..." : "Save Changes"}
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
