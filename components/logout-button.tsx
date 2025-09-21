import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { logoutAction } from "@/app/auth/logout/actions"

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button
        type="submit"
        variant="outline"
        size="sm"
        className="bg-transparent border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </form>
  )
}
