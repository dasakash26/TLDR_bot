import {
  useMutation,
  useQueryClient,
  UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";

interface MutationConfig<TData = any, TVariables = any> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  invalidateKeys?: string[][];
  successMessage?: string;
  errorMessage?: string;
  onSuccessCallback?: (
    data: TData,
    variables: TVariables,
    queryClient: any
  ) => void;
}

export function createMutation<TData = any, TVariables = any>({
  mutationFn,
  invalidateKeys = [],
  successMessage,
  errorMessage = "An error occurred",
  onSuccessCallback,
}: MutationConfig<TData, TVariables>) {
  return function useMutationHook(
    additionalOptions?: Partial<UseMutationOptions<TData, Error, TVariables>>
  ) {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables>({
      mutationFn,
      onSuccess: (data, variables, context) => {
        // Call custom callback with queryClient first
        if (onSuccessCallback) {
          onSuccessCallback(data, variables, queryClient);
        }

        // Invalidate queries to refetch data
        invalidateKeys.forEach((key) => {
          queryClient.invalidateQueries({ queryKey: key });
        });

        // Show success toast
        if (successMessage) {
          toast.success(successMessage);
        }

        // Call additional onSuccess if provided
        if (additionalOptions?.onSuccess) {
          (additionalOptions.onSuccess as any)(data, variables, context);
        }
      },
      onError: (error, variables, context) => {
        toast.error(errorMessage);
        if (additionalOptions?.onError) {
          (additionalOptions.onError as any)(error, variables, context);
        }
      },
      ...additionalOptions,
    });
  };
}
