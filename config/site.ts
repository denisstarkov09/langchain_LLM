import { NavItem } from "@/types"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    github: string
  }
}

export const siteConfig: SiteConfig = {
  name: "PDF ChatBot",
  description: "Unlock the secrets of any website",
  mainNav: [],
  links: {
    twitter: "",
    github: "",
  },
}
