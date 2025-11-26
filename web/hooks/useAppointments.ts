import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentsApi } from "@/lib/api";
import type {
  PaginatedResult,
  Appointment,
  CreateAppointmentRequest,
} from "@/types";

export function useAppointments(page: number = 1, limit: number = 10) {
  return useQuery<PaginatedResult<Appointment>>({
    queryKey: ["appointments", page, limit],
    queryFn: () => appointmentsApi.getAll({ page, limit }),
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateAppointmentRequest>;
    }) => appointmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
