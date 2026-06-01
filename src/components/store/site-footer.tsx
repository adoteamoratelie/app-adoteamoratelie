import Link from "next/link"

import { siteConfig } from "@/config/site"

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <strong className="text-sm font-semibold">{siteConfig.name}</strong>
          <p className="mt-1 text-sm text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="transition hover:text-foreground">
            Início
          </Link>

          <Link href="/admin" className="transition hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}