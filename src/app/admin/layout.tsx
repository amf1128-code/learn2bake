import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-6">
          <Link href="/admin" className="font-bold text-lg">
            learn2bake Admin
          </Link>
          <div className="flex gap-4 text-sm">
            <Link
              href="/admin/recipes"
              className="text-gray-600 hover:text-gray-900"
            >
              Recipes
            </Link>
            <Link
              href="/admin/curriculum"
              className="text-gray-600 hover:text-gray-900"
            >
              Curriculum
            </Link>
            <Link
              href="/admin/site-settings"
              className="text-gray-600 hover:text-gray-900"
            >
              Site Settings
            </Link>
          </div>
          <div className="ml-auto">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
              View Site &rarr;
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
