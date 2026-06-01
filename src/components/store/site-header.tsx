"use client"

import Link from "next/link"
import { Menu, MessageCircle, PawPrint, } from "lucide-react"

import { siteConfig } from "@/config/site"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <PawPrint className="size-5"/>
          </div>

          <div className="leading-0">
            <strong className="block text-sm font-semibold">
              {siteConfig.name}
            </strong>
            <span className="text-xs text-muted-foreground">
              Vitrine online
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild>
            <a
              href={`https://wa.me/${siteConfig.whatsapp.phone}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 size-4" />
              WhatsApp
            </a>
          </Button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </SheetTrigger>

          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{siteConfig.name}</SheetTitle>
            </SheetHeader>

            <div className="p-4">
              <nav className="flex flex-col gap-4">
                {siteConfig.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-base font-medium text-muted-foreground transition hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <Button asChild className="mt-8 w-full">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}