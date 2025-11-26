"use client";

import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { usePathname } from "next/navigation";

type IStateMessages = {
  success?: string;
  error?: string;
  loading?: string;
};

const useMutationNotification = ({
  success = "done",
  error: errorMessage = "error",
  loading = "loading...",
}: IStateMessages = {}) => {
  const toastId = useRef<any>("");
  const pathName = usePathname();
  let duration = 5000;

  let dismiss = () => {
    if (toastId.current) toast.dismiss(toastId.current);
  };

  const onSettled = () => {
    dismiss();
  };

  const onMutate = () => {
    toast.dismiss();
    toastId.current = toast.loading(loading);
  };

  const onSuccess = (data: any) => {
    const message = success ?? data?.message;
    dismiss(); // Dismiss loading toast
    toast.success(message, { duration });
  };

  const onError = (error: any) => {
    const message = error?.response?.data?.message ?? errorMessage;
    dismiss(); // Dismiss loading toast
    toast.error(message, { duration });
  };

  useEffect(
    () => {
      dismiss();
      toast.dismiss(toastId.current);
    },
    // eslint-disable-next-line
    [pathName]
  );

  return { onSuccess, onError, onMutate, onSettled };
};

export default useMutationNotification;
