import { toast } from "sonner"

export function useToast() {
    return {
        toast,
        dismiss: toast.dismiss,
        error: (message) => toast.error(message),
        success: (message) => toast.success(message),
    }
} 