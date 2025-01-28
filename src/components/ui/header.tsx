import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-8 sm:px-16 lg:px-32">
        <div className="max-w-5xl mx-auto h-14 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
            Net Hesaplama
          </Link>
          <div className="flex items-center bg-muted/30 rounded-lg p-1">
            <Link
              href="/"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/" ? "bg-background shadow-sm" : "hover:bg-background/50"
              }`}
            >
              TYT
            </Link>
            <Link
              href="/ayt"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                pathname === "/ayt" ? "bg-background shadow-sm" : "hover:bg-background/50"
              }`}
            >
              AYT
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 