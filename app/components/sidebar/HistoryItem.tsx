"use client"

import { MessageSquare, Trash2 } from "lucide-react"
import { type ChatHistoryItem } from '~/lib/persistence'
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { DialogTrigger } from "~/components/ui/Dialog"

interface HistoryItemProps {
  item: ChatHistoryItem
  onDelete?: (event: React.UIEvent) => void
}

export function HistoryItem({ item, onDelete }: HistoryItemProps) {
  return (
    <div className="group relative flex items-center">
      <a
        href={`/chat/${item.urlId}`}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
      >
        <MessageSquare className="h-4 w-4 shrink-0" />
        <span className="truncate">{item.description}</span>
      </a>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 h-6 w-6 shrink-0 text-muted-foreground/50 hover:text-destructive",
            "opacity-0 group-hover:opacity-100 transition-opacity",
            "focus-visible:opacity-100"
          )}
          onClick={(event) => {
            event.preventDefault()
            onDelete?.(event)
          }}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete chat</span>
        </Button>
      </DialogTrigger>
    </div>
  )
}
