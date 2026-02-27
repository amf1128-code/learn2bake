import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg text-foreground tracking-wide">
          learn2bake
        </Link>
        <div className="flex gap-7 text-sm">
          <Link
            href="/learn"
            className="text-muted hover:text-foreground transition-colors"
          >
            Lessons
          </Link>
          <Link
            href="/recipes"
            className="text-muted hover:text-foreground transition-colors"
          >
            Recipes
          </Link>
          <Link
            href="/concepts"
            className="text-muted hover:text-foreground transition-colors"
          >
            Concepts
          </Link>
        </div>
      </nav>
    </header>
  );
}
