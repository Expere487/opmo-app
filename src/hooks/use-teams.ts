'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Team {
  id: number
  name: string
  role: 'owner' | 'member'
  created_at: string
}

export function useTeams() {
  const { data: session } = useSession()
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeams() {
      if (!session?.user) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/teams')
        if (!response.ok) {
          throw new Error('Team verileri alınamadı')
        }
        
        const teamsData = await response.json()
        setTeams(teamsData)
        
        // İlk team'i seçili olarak ayarla
        if (teamsData.length > 0 && !selectedTeam) {
          setSelectedTeam(teamsData[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen hata')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [session])

  const switchTeam = (team: Team) => {
    setSelectedTeam(team)
    // Local storage'a kaydet
    localStorage.setItem('selectedTeam', JSON.stringify(team))
  }

  // Component mount'ta local storage'dan seçili team'i oku
  useEffect(() => {
    const savedTeam = localStorage.getItem('selectedTeam')
    if (savedTeam && teams.length > 0) {
      try {
        const parsed = JSON.parse(savedTeam)
        const teamExists = teams.find(t => t.id === parsed.id)
        if (teamExists) {
          setSelectedTeam(teamExists)
        }
      } catch {
        // Local storage'daki veri bozuksa ignore et
      }
    }
  }, [teams])

  return {
    teams,
    selectedTeam,
    loading,
    error,
    switchTeam
  }
} 