import { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useSandboxKV } from '@/hooks/use-sandbox-kv'
import { calculateLevel } from '@/lib/game-utils'
import type {
  Realm,
  Quest,
  UserProfile,
  Submission,
  KnowledgeCrystal,
  Artifact,
  AvatarCustomization,
  Role
} from '@/lib/types'
import { DEFAULT_AVATAR } from '@/lib/avatar-options'
import { toast } from 'sonner'
import { soundEffects } from '@/lib/sound-effects'

const DEFAULT_PROFILE: UserProfile = {
  id: 'user-1',
  name: '',
  role: 'student',
  xp: 0,
  level: 1,
  artifacts: [],
  avatar: DEFAULT_AVATAR
}

interface GameStateContextValue {
  // State
  realms: Realm[]
  quests: Quest[]
  submissions: Submission[]
  crystals: KnowledgeCrystal[]
  profile: UserProfile
  allProfiles: UserProfile[]

  // Realm actions
  setRealms: (realms: Realm[]) => void
  addRealm: (realm: Realm) => void
  deleteRealm: (realmId: string) => void

  // Quest actions
  setQuests: (quests: Quest[]) => void
  addQuest: (quest: Quest) => void
  deleteQuest: (questId: string) => void
  updateQuestStatus: (questId: string, status: Quest['status']) => void

  // Submission actions
  setSubmissions: (submissions: Submission[]) => void
  addSubmission: (submission: Submission) => void
  updateSubmission: (submission: Submission) => void

  // Crystal actions
  setCrystals: (crystals: KnowledgeCrystal[]) => void
  addCrystal: (crystal: KnowledgeCrystal) => void
  attuneCrystal: (crystalId: string) => void

  // Profile actions
  setProfile: (profile: UserProfile) => void
  updateProfileXp: (xpGained: number) => { newXp: number; newLevel: number; oldLevel: number }
  addArtifact: (artifact: Artifact) => void
  updateAvatar: (avatar: AvatarCustomization) => void
  setProfileName: (name: string) => void
  setProfileRole: (role: Role) => void

  // Bulk import
  importRealms: (newRealms: Realm[]) => void
  importQuests: (newQuests: Quest[]) => void
}

const GameStateContext = createContext<GameStateContextValue | null>(null)

interface GameStateProviderProps {
  children: ReactNode
}

export function GameStateProvider({ children }: GameStateProviderProps) {
  const [realms, setRealms] = useSandboxKV<Realm[]>('aetheria-realms', [])
  const [quests, setQuests] = useSandboxKV<Quest[]>('aetheria-quests', [])
  const [submissions, setSubmissions] = useSandboxKV<Submission[]>('aetheria-submissions', [])
  const [crystals, setCrystals] = useSandboxKV<KnowledgeCrystal[]>('aetheria-crystals', [])
  const [profile, setProfile] = useSandboxKV<UserProfile>('aetheria-profile', DEFAULT_PROFILE)
  const [allProfiles, setAllProfiles] = useSandboxKV<UserProfile[]>('aetheria-all-profiles', [])
  const [soundVolume] = useKV<number>('aetheria-sound-volume', 0.3)
  const [soundMuted] = useKV<boolean>('aetheria-sound-muted', false)

  const currentRealms = realms || []
  const currentQuests = quests || []
  const currentSubmissions = submissions || []
  const currentCrystals = crystals || []
  const currentProfile = profile || DEFAULT_PROFILE
  const currentAllProfiles = allProfiles || []

  // Sound effects setup
  useEffect(() => {
    soundEffects.setVolume(soundVolume ?? 0.3)
    soundEffects.setEnabled(!(soundMuted ?? false))
  }, [soundVolume, soundMuted])

  // Sync profile to allProfiles
  useEffect(() => {
    if (currentProfile && currentAllProfiles) {
      const existingIndex = currentAllProfiles.findIndex(p => p.id === currentProfile.id)
      if (existingIndex >= 0) {
        const updated = [...currentAllProfiles]
        updated[existingIndex] = currentProfile
        setAllProfiles(updated)
      } else if (currentProfile.id !== 'user-1') {
        setAllProfiles([...currentAllProfiles, currentProfile])
      }
    }
  }, [currentProfile?.id, currentProfile?.xp, currentProfile?.name])

  // Realm actions
  const addRealm = useCallback((realm: Realm) => {
    setRealms([...currentRealms, realm])
  }, [currentRealms, setRealms])

  const deleteRealm = useCallback((realmId: string) => {
    setRealms(currentRealms.filter(r => r.id !== realmId))
  }, [currentRealms, setRealms])

  // Quest actions
  const addQuest = useCallback((quest: Quest) => {
    setQuests([...currentQuests, quest])
  }, [currentQuests, setQuests])

  const deleteQuest = useCallback((questId: string) => {
    setQuests(currentQuests.filter(q => q.id !== questId))
    setSubmissions(currentSubmissions.filter(s => s.questId !== questId))
    setCrystals(currentCrystals.filter(c => c.questId !== questId))
  }, [currentQuests, currentSubmissions, currentCrystals, setQuests, setSubmissions, setCrystals])

  const updateQuestStatus = useCallback((questId: string, status: Quest['status']) => {
    setQuests(currentQuests.map(q => q.id === questId ? { ...q, status } : q))
  }, [currentQuests, setQuests])

  // Submission actions
  const addSubmission = useCallback((submission: Submission) => {
    setSubmissions([...currentSubmissions, submission])
  }, [currentSubmissions, setSubmissions])

  const updateSubmission = useCallback((submission: Submission) => {
    setSubmissions(currentSubmissions.map(s => s.id === submission.id ? submission : s))
  }, [currentSubmissions, setSubmissions])

  // Crystal actions
  const addCrystal = useCallback((crystal: KnowledgeCrystal) => {
    setCrystals([...currentCrystals, crystal])
  }, [currentCrystals, setCrystals])

  const attuneCrystal = useCallback((crystalId: string) => {
    soundEffects.play('crystal-attune')
    setCrystals(currentCrystals.map(c => c.id === crystalId ? { ...c, isAttuned: true } : c))
    setQuests(currentQuests.map(q =>
      q.prerequisiteIds?.includes(crystalId) ? { ...q, status: 'available' as const } : q
    ))
    toast.success('Crystal attuned!', { description: 'Redemption quest unlocked' })
  }, [currentCrystals, currentQuests, setCrystals, setQuests])

  // Profile actions
  const updateProfileXp = useCallback((xpGained: number) => {
    const oldLevel = calculateLevel(currentProfile.xp)
    const newXp = currentProfile.xp + xpGained
    const newLevel = calculateLevel(newXp)
    const updatedProfile = { ...currentProfile, xp: newXp, level: newLevel }
    setProfile(updatedProfile)
    return { newXp, newLevel, oldLevel }
  }, [currentProfile, setProfile])

  const addArtifact = useCallback((artifact: Artifact) => {
    const updatedProfile = {
      ...currentProfile,
      artifacts: [...currentProfile.artifacts, artifact]
    }
    setProfile(updatedProfile)
  }, [currentProfile, setProfile])

  const updateAvatar = useCallback((avatar: AvatarCustomization) => {
    const updatedProfile = { ...currentProfile, avatar }
    setProfile(updatedProfile)
    toast.success('Avatar updated!')
  }, [currentProfile, setProfile])

  const setProfileName = useCallback((name: string) => {
    const updatedProfile = {
      ...currentProfile,
      name,
      id: `user-${Date.now()}`,
      avatar: currentProfile.avatar || DEFAULT_AVATAR
    }
    setProfile(updatedProfile)
    toast.success(`Welcome, ${name}!`)
  }, [currentProfile, setProfile])

  const setProfileRole = useCallback((role: Role) => {
    const updatedProfile = { ...currentProfile, role }
    setProfile(updatedProfile)
  }, [currentProfile, setProfile])

  // Bulk import
  const importRealms = useCallback((newRealms: Realm[]) => {
    setRealms([...currentRealms, ...newRealms])
  }, [currentRealms, setRealms])

  const importQuests = useCallback((newQuests: Quest[]) => {
    setQuests([...currentQuests, ...newQuests])
  }, [currentQuests, setQuests])

  const value = useMemo<GameStateContextValue>(
    () => ({
      realms: currentRealms,
      quests: currentQuests,
      submissions: currentSubmissions,
      crystals: currentCrystals,
      profile: currentProfile,
      allProfiles: currentAllProfiles,
      setRealms,
      addRealm,
      deleteRealm,
      setQuests,
      addQuest,
      deleteQuest,
      updateQuestStatus,
      setSubmissions,
      addSubmission,
      updateSubmission,
      setCrystals,
      addCrystal,
      attuneCrystal,
      setProfile,
      updateProfileXp,
      addArtifact,
      updateAvatar,
      setProfileName,
      setProfileRole,
      importRealms,
      importQuests,
    }),
    [
      currentRealms,
      currentQuests,
      currentSubmissions,
      currentCrystals,
      currentProfile,
      currentAllProfiles,
      setRealms,
      addRealm,
      deleteRealm,
      setQuests,
      addQuest,
      deleteQuest,
      updateQuestStatus,
      setSubmissions,
      addSubmission,
      updateSubmission,
      setCrystals,
      addCrystal,
      attuneCrystal,
      setProfile,
      updateProfileXp,
      addArtifact,
      updateAvatar,
      setProfileName,
      setProfileRole,
      importRealms,
      importQuests,
    ]
  )

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export function useGameState() {
  const context = useContext(GameStateContext)
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }
  return context
}
