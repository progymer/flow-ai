"use client";

import { ModeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };
  return (
    <div className="border-b border-border bg-background">
      <div className="w-full px-4 lg:px-0 mx-auto max-w-6xl h-11 flex items-center justify-between">
        <div></div>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="size-8 shrink-0 rounded-full">
                <AvatarImage src={data?.user.image ?? undefined} alt={data?.user.name}/>
                <AvatarFallback className="rounded-full">
                  {data?.user.name[0].toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleSignOut}
              >
                <LogOutIcon className="h-4 w-4" />
                <span>log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Header