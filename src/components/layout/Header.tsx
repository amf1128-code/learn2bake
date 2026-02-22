import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border bg-surface sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-accent">
          learn2bake
        </Link>
        <div className="flex gap-6 text-sm font-medium">
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
