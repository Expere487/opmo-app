'use client'

import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { useState } from 'react'
import { useTeams } from '@/hooks/use-teams'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export function TeamSelector() {
  const { teams, selectedTeam, loading, switchTeam } = useTeams()
  const [open, setOpen] = useState(false)

  if (loading) {
    return (
      <Button variant="ghost" size="sm" className="h-8 px-2">
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </Button>
    )
  }

  if (!selectedTeam || teams.length === 0) {
    return (
      <Button variant="ghost" size="sm" className="h-8 px-2">
        Team Yok
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-8 justify-between px-2 font-normal"
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-full w-full rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                {selectedTeam.name.charAt(0).toUpperCase()}
              </div>
            </Avatar>
            <span className="truncate max-w-[120px]">
              {selectedTeam.name}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-1" align="start">
        <div className="space-y-1">
          {teams.map((team) => (
            <Button
              key={team.id}
              variant="ghost"
              size="sm"
              className="w-full justify-start h-auto p-2"
              onClick={() => {
                switchTeam(team)
                setOpen(false)
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <Avatar className="h-5 w-5">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-full w-full rounded-full flex items-center justify-center text-[10px] font-semibold text-white">
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                </Avatar>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm truncate">
                    {team.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {team.role === 'owner' ? 'Sahip' : 'Üye'}
                  </div>
                </div>
                {selectedTeam.id === team.id && (
                  <Check className="h-3 w-3" />
                )}
              </div>
            </Button>
          ))}
        </div>
        
        <Separator className="my-1" />
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start h-auto p-2"
          onClick={() => {
            // Team oluşturma modal'ını aç
            setOpen(false)
          }}
        >
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
              <Plus className="h-3 w-3" />
            </div>
            <span className="text-sm">Yeni Team Oluştur</span>
          </div>
        </Button>
      </PopoverContent>
    </Popover>
  )
} 