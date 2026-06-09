import { useCallback } from "react";
import toast from "react-hot-toast";

interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) => Promise<T>;
}

export function useToast(): ToastActions {
  const success = useCallback((message: string) => {
    toast.success(message, {
      duration: 4000,
      position: "top-right",
    });
  }, []);

  const error = useCallback((message: string) => {
    toast.error(message, {
      duration: 5000,
      position: "top-right",
    });
  }, []);

  const warning = useCallback((message: string) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "⚠️",
    });
  }, []);

  const info = useCallback((message: string) => {
    toast(message, {
      duration: 4000,
      position: "top-right",
      icon: "ℹ️",
    });
  }, []);

  const promiseFn = useCallback(
    <T>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string }
    ): Promise<T> => {
      return toast.promise(promise, {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      });
    },
    []
  );

  return {
    success,
    error,
    warning,
    info,
    promise: promiseFn,
  };
}
