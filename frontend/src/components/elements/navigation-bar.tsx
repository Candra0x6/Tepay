import { LogIn, LogOut, Smile } from "lucide-react";
import React from "react";
import TepayLogo from "../tepay-logo";
import { useAuth } from "@/hooks/use-auth-client";
import { formatPrincipal } from "@/utils/vaultPayUtils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Principal } from "@dfinity/principal";

function Navbar() {
  const { principal, logout, login } = useAuth();
  const anonymousPrincipal = Principal.anonymous();

  return (
    <header className="w-full flex justify-center z-50 h-24 bg-background ">
      <div className="max-w-3xl mx-auto flex items-center justify-between fixed top-0 left-0 right-0 mt-4 z-50 gap-2 bg-white neumorphic-border">
        {/* Logo */}
        <TepayLogo className="w-16 aspect-square" />

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* User Wallet Badge */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 bg-white border-2 border-black rounded-xl px-3 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                <span className="font-bold text-sm">
                  {principal && !principal.isAnonymous()
                    ? formatPrincipal(principal)
                    : "Not connected"}
                </span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-4 border-black rounded-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="">
                <DropdownMenuItem>
                  {principal && !principal.isAnonymous() ? (
                    <Button
                      className="text-lg text-black w-full"
                      onClick={logout}
                    >
                      Logout <LogOut />
                    </Button>
                  ) : (
                    <Button
                      className="text-lg text-black w-full"
                      onClick={login}
                    >
                      Connect Identity <LogIn />
                    </Button>
                  )}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
