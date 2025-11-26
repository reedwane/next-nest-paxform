import { Calendar, Mail, User, FileText, Trash2, Eye } from "lucide-react";
import type { Appointment } from "@/types";

interface AppointmentsTableProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onView: (appointment: Appointment) => void;
}

export default function AppointmentsTable({
  appointments,
  onDelete,
  onView,
}: AppointmentsTableProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (appointments.length === 0) {
    return (
      <div className="p-12 text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No appointments yet</p>
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
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Date & Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-primary-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-primary-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr
                key={appointment.id}
                onClick={() => onView(appointment)}
                className="hover:bg-primary-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-primary-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {appointment.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {appointment.email}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {formatDateTime(appointment.appointmentDateTime)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {appointment.googleEventId ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                      Synced
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Not synced
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onView(appointment);
                      }}
                      className="text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(appointment.id);
                      }}
                      className="text-red-600 hover:text-red-700 inline-flex items-center gap-1"
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
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            onClick={() => onView(appointment)}
            className="p-4 hover:bg-primary-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-primary-500" />
                  <h3 className="font-medium text-gray-900">
                    {appointment.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{appointment.email}</span>
                </div>
              </div>
              {appointment.googleEventId && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                  Synced
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{formatDateTime(appointment.appointmentDateTime)}</span>
            </div>

            {appointment.notes && (
              <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="line-clamp-2">{appointment.notes}</p>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onView(appointment);
                }}
                className="flex-1 text-center px-3 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                View Details
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(appointment.id);
                }}
                className="px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
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
