import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-surface border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <Link href="/admin" className="font-serif text-lg text-foreground">
            learn2bake Admin
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              href="/admin/recipes"
              className="text-muted hover:text-foreground transition-colors"
            >
              Recipes
            </Link>
            <Link
              href="/admin/curriculum"
              className="text-muted hover:text-foreground transition-colors"
            >
              Curriculum
            </Link>
            <Link
              href="/admin/site-settings"
              className="text-muted hover:text-foreground transition-colors"
            >
              Site Settings
            </Link>
          </div>
          <div className="ml-auto">
            <Link href="/" className="text-sm text-muted hover:text-foreground transition-colors">
              View Site &rarr;
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
