"use client"

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { MessageSquarePlus, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "~/components/ui/Dialog"
import { Button } from "~/components/ui/button"
import { ThemeSwitch } from '~/components/ui/ThemeSwitch'
import { db, deleteById, getAll, chatId, type ChatHistoryItem } from '~/lib/persistence'
import { logger } from '~/utils/logger'
import { HistoryItem } from './HistoryItem'
import { binDates } from './date-binning'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "./sidebar"

type DialogContent = { type: 'delete'; item: ChatHistoryItem } | null

export function Menu() {
  const [list, setList] = useState<ChatHistoryItem[]>([])
  const [dialogContent, setDialogContent] = useState<DialogContent>(null)
  const { theme, setTheme } = useTheme()

  const loadEntries = useCallback(() => {
    if (db) {
      getAll(db)
        .then((list) => list.filter((item) => item.urlId && item.description))
        .then(setList)
        .catch((error) => toast.error(error.message))
    }
  }, [])

  const deleteItem = useCallback((event: React.UIEvent, item: ChatHistoryItem) => {
    event.preventDefault()

    if (db) {
      deleteById(db, item.id)
        .then(() => {
          loadEntries()

          if (chatId.get() === item.id) {
            // hard page navigation to clear the stores
            window.location.pathname = '/'
          }
        })
        .catch((error) => {
          toast.error('Failed to delete conversation')
          logger.error(error)
        })
    }
  }, [])

  const closeDialog = () => {
    setDialogContent(null)
  }

  useEffect(() => {
    loadEntries()
  }, [loadEntries])

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Your Chats</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <div className="space-y-4">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={() => window.location.pathname = '/'}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
            <div className="py-2">
              {list.length === 0 && <div className="text-sm text-muted-foreground px-2">No previous conversations</div>}
              {binDates(list).map(({ category, items }) => (
                <div key={category} className="mt-4 first:mt-0 space-y-1">
                  <div className="text-sm font-medium text-muted-foreground sticky top-0 z-1 px-2 pt-2 pb-1">
                    {category}
                  </div>
                  {items.map((item) => (
                    <HistoryItem key={item.id} item={item} onDelete={() => setDialogContent({ type: 'delete', item })} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </SidebarContent>
        <SidebarFooter>
          <ThemeSwitch />
        </SidebarFooter>
      </Sidebar>

      <Dialog open={dialogContent !== null} onOpenChange={() => closeDialog()}>
        <DialogContent>
          {dialogContent?.type === 'delete' && (
            <>
              <DialogHeader>
                <DialogTitle>Delete Chat?</DialogTitle>
                <DialogDescription>
                  You are about to delete <strong>{dialogContent.item.description}</strong>.
                  Are you sure you want to delete this chat?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={(event) => {
                    deleteItem(event, dialogContent.item)
                    closeDialog()
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
