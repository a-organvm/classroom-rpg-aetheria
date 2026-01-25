import { XP_LEVEL_THRESHOLDS, RARITY_THRESHOLDS } from './constants'

export function calculateLevel(xp: number): number {
  for (let i = XP_LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_LEVEL_THRESHOLDS[i]) {
      return i + 1
    }
  }
  return 1
}

export function getXpForNextLevel(currentXp: number): number {
  const level = calculateLevel(currentXp)
  return XP_LEVEL_THRESHOLDS[level] || XP_LEVEL_THRESHOLDS[XP_LEVEL_THRESHOLDS.length - 1]
}

export function getLevelTitle(level: number, role: 'teacher' | 'student'): string {
  if (role === 'teacher') {
    const titles = ['Initiate', 'Mentor', 'Master', 'Sage', 'Archmaster', 'Legend', 'Eternal', 'Transcendent']
    return titles[Math.min(level - 1, titles.length - 1)]
  } else {
    const titles = ['Novice', 'Apprentice', 'Adept', 'Expert', 'Master', 'Champion', 'Hero', 'Legend']
    return titles[Math.min(level - 1, titles.length - 1)]
  }
}

export function generateArtifactName(score: number, questName: string, theme: string): string {
  const prefixes = {
    fantasy: ['Enchanted', 'Mystical', 'Ancient', 'Ethereal', 'Radiant'],
    scifi: ['Quantum', 'Neural', 'Encrypted', 'Holographic', 'Plasma'],
    medieval: ['Royal', 'Noble', 'Heraldic', 'Forged', 'Sacred'],
    modern: ['Digital', 'Smart', 'Advanced', 'Innovative', 'Premium']
  }
  
  const suffixes = {
    fantasy: ['Scroll', 'Tome', 'Crystal', 'Rune', 'Amulet'],
    scifi: ['Chip', 'Core', 'Drive', 'Matrix', 'Protocol'],
    medieval: ['Seal', 'Banner', 'Crown', 'Chalice', 'Sigil'],
    modern: ['Badge', 'Certificate', 'Award', 'Token', 'Medal']
  }

  const themeKey = theme as keyof typeof prefixes
  const prefix = prefixes[themeKey][Math.floor(Math.random() * prefixes[themeKey].length)]
  const suffix = suffixes[themeKey][Math.floor(Math.random() * suffixes[themeKey].length)]
  
  const conceptWords = questName.split(' ').filter(w => w.length > 4)
  const concept = conceptWords[Math.floor(Math.random() * conceptWords.length)] || 'Mastery'
  
  return `${prefix} ${suffix} of ${concept}`
}

export function getRarityFromScore(score: number): 'common' | 'rare' | 'epic' | 'legendary' {
  if (score >= RARITY_THRESHOLDS.legendary) return 'legendary'
  if (score >= RARITY_THRESHOLDS.epic) return 'epic'
  if (score >= RARITY_THRESHOLDS.rare) return 'rare'
  return 'common'
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
