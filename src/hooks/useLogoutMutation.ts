import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiRequest, apiEndPoints } from "@/config"

export function useLogoutMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { url, method } = apiEndPoints.auth.logout
      await apiRequest({ url, method })
    },
    onSettled: () => {
      queryClient.setQueryData(["auth", "me"], null)
      queryClient.clear()
    },
  })
}