"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Scraper Dashboard
        </Link>
        <div className="flex gap-6">
          <Link href="/industries" className="hover:text-blue-600">
            Industries
          </Link>
          <Link href="/queries" className="hover:text-blue-600">
            Queries
          </Link>
          <Link href="/leads" className="hover:text-blue-600">
            Leads
          </Link>
        </div>
      </div>
    </nav>
  );
}
