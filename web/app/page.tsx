"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Calendar,
  Clock,
  Mail,
  User,
  FileText,
  CheckCircle,
} from "lucide-react";
import { appointmentsApi } from "@/lib/api";
import type { CreateAppointmentRequest } from "@/types";
import Link from "next/link";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateAppointmentRequest>();

  const onSubmit = async (data: CreateAppointmentRequest) => {
    setIsSubmitting(true);
    setError("");

    try {
      await appointmentsApi.create(data);
      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-700">
            Appointment Booking
          </h1>
          <Link
            href={"/login"}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Book an Appointment
            </h2>
            <p className="text-gray-600">
              Fill out the form below to schedule your appointment
            </p>
          </div>

          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">
                  Appointment booked successfully!
                </p>
                <p className="text-green-700 text-sm mt-1">
                  You will receive a calendar invitation at your email address.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                id="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                id="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Date & Time */}
            <div>
              <label
                htmlFor="appointmentDateTime"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                <Clock className="w-4 h-4 inline mr-2" />
                Preferred Date & Time
              </label>
              <input
                {...register("appointmentDateTime", {
                  required: "Date and time are required",
                })}
                type="datetime-local"
                id="appointmentDateTime"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              {errors.appointmentDateTime && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.appointmentDateTime.message}
                </p>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Additional Notes (Optional)
              </label>
              <textarea
                {...register("notes")}
                id="notes"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Any specific requirements or notes..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
