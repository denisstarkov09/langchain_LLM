import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { NavItem } from "@/types"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/Layouts"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"

export function NavHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-b-mauve-7 backdrop-blur   ">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <NavItems items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}

interface NavItemsProps {
  items?: NavItem[]
}

function NavItems({ items }: NavItemsProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className=" flex items-center space-x-2">
        <div className="md:h-13 relative h-10 w-10">
          <Image fill className="absolute" src="/favicon.ico" alt="logo" />
        </div>
        <span className="hidden font-aboreto font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-100 sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}
    </div>
  )
}
