import { ReactNode } from "react";
import Link from "next/link";
import { Moon, User } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { ROUTES } from "@/config/routes.config";
import { useCurrentUser } from "@/hooks/users/use-current-user";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { data } = useCurrentUser();
  const user = data?.data;
  const { theme, setTheme } = useTheme();

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.clear();
    signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            {user?.avatarFile?.url ? (
              <img
                className="size-10 rounded-full border-2 border-primary shrink-0 cursor-pointer"
                src={user.avatarFile.url}
                alt="User Avatar"
              />
            ) : (
              <div className="size-10 rounded-full border-2 shrink-0 cursor-pointer flex items-center justify-center">
                <User className="size-5" />
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-semibold line-clamp-1">{user?.name || ""}</p>
              <p className="text-xs text-muted-foreground line-clamp-1">{user?.email || ""}</p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={ROUTES.ME} className="flex items-center gap-2">
            <User />
            Akun Saya
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex items-center gap-2 justify-between grow">
            Dark Mode
            <Switch size="sm" checked={theme === "dark"} onCheckedChange={handleThemeToggle} />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
            shape="circle"
          >
            Logout
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
