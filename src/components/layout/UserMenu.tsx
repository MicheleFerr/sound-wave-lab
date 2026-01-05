// src/components/layout/UserMenu.tsx
'use client'

import { User } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
  user: { email: string; isAdmin: boolean } | null
}

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/login" aria-label="Accedi">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Menu utente">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/account">Il mio account</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/orders">I miei ordini</Link>
        </DropdownMenuItem>
        {user.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Panel</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action="/api/auth/logout" method="POST">
            <button type="submit" className="w-full text-left">
              Esci
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
