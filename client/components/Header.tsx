
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Menu } from "lucide-react";

export function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="https://dsqvyt2qb7cgs.cloudfront.net/app/uploads/2025/01/wme-og.webp"
                alt="WME"
                className="h-8 w-auto object-contain"
              />
              <div>
                <h1 className="text-lg font-semibold font-display tracking-tight text-gray-800">
                  WME
                </h1>
                <p className="text-xs text-gray-500">Client Portal</p>
              </div>
            </Link>
          </div>
          <div className="hidden md:flex md:items-center md:gap-8">
            <nav className="flex items-center gap-6 text-sm text-gray-500">
              <Link
                to="/terms"
                className="hover:text-wme-gold transition-colors"
              >
                Terms
              </Link>
              <Link
                to="/privacy"
                className="hover:text-wme-gold transition-colors"
              >
                Privacy
              </Link>
            </nav>
            <Button asChild>
              <Link to="/dashboard">Client Login</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6 text-gray-600" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-3">
                      <img
                        src="https://dsqvyt2qb7cgs.cloudfront.net/app/uploads/2025/01/wme-og.webp"
                        alt="WME"
                        className="h-8 w-auto object-contain"
                      />
                      <div>
                        <h1 className="text-lg font-semibold font-display tracking-tight text-gray-800">
                          WME
                        </h1>
                        <p className="text-xs text-gray-500">Client Portal</p>
                      </div>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                  <nav className="flex flex-col items-start gap-4">
                    <Link
                      to="/terms"
                      className="text-lg text-gray-600 hover:text-wme-gold transition-colors"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Terms
                    </Link>
                    <Link
                      to="/privacy"
                      className="text-lg text-gray-600 hover:text-wme-gold transition-colors"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Privacy
                    </Link>
                    <Button
                      asChild
                      className="w-full mt-4"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Link to="/dashboard">Client Login</Link>
                    </Button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
