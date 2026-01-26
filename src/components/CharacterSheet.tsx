import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { UserProfile, Theme, THEME_CONFIGS, Artifact, StudentPreferences, ThematicInterest, LearningStyle, THEMATIC_INTERESTS } from '@/lib/types'
import { calculateLevel, getLevelTitle, getXpForNextLevel } from '@/lib/game-utils'
import { Sparkle, Star, TrendUp, Pencil, Sliders } from '@phosphor-icons/react'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { AvatarEditor } from '@/components/AvatarEditor'
import { PreferencesModal } from '@/components/PreferencesModal'
import { DEFAULT_AVATAR } from '@/lib/avatar-options'
import type { AvatarCustomization } from '@/lib/types'

interface CharacterSheetProps {
  profile: UserProfile
  theme: Theme
  onUpdateAvatar?: (avatar: AvatarCustomization) => void
  currentPreferences?: StudentPreferences
  onUpdatePreferences?: (
    primaryInterest: ThematicInterest,
    secondaryInterest?: ThematicInterest,
    learningStyle?: LearningStyle
  ) => void
}

export function CharacterSheet({ profile, theme, onUpdateAvatar, currentPreferences, onUpdatePreferences }: CharacterSheetProps) {
  const [isEditingAvatar, setIsEditingAvatar] = useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)
  const themeConfig = THEME_CONFIGS[theme]
  const level = calculateLevel(profile.xp)
  const levelTitle = getLevelTitle(level, profile.role)
  const nextLevelXp = getXpForNextLevel(profile.xp)
  const xpProgress = ((profile.xp % nextLevelXp) / nextLevelXp) * 100

  const handleSaveAvatar = (avatar: AvatarCustomization) => {
    if (onUpdateAvatar) {
      onUpdateAvatar(avatar)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'border-accent bg-accent/10'
      case 'epic': return 'border-secondary bg-secondary/10'
      case 'rare': return 'border-primary bg-primary/10'
      default: return 'border-muted bg-muted/10'
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return <Badge className="bg-accent text-accent-foreground">Legendary</Badge>
      case 'epic': return <Badge className="bg-secondary text-secondary-foreground">Epic</Badge>
      case 'rare': return <Badge className="bg-primary text-primary-foreground">Rare</Badge>
      default: return <Badge variant="outline">Common</Badge>
    }
  }

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div className="glass-panel p-8 space-y-6">
        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="w-32 h-32">
              <AvatarDisplay 
                avatar={profile.avatar || DEFAULT_AVATAR} 
                size="lg"
                className="border-4 border-accent rounded-full bg-card"
              />
            </div>
            {onUpdateAvatar && (
              <Button
                size="sm"
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditingAvatar(true)}
              >
                <Pencil size={18} weight="bold" />
              </Button>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <div className="flex items-center gap-3">
                <Badge variant="default" className="text-lg px-4 py-1">
                  Level {level}
                </Badge>
                <span className="text-xl text-primary font-semibold">{levelTitle}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{themeConfig.xpLabel} Progress</span>
                <span className="text-sm font-medium">{profile.xp} / {nextLevelXp}</span>
              </div>
              <Progress value={xpProgress} className="h-3" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendUp size={16} />
                <span>{nextLevelXp - profile.xp} {themeConfig.xpLabel} to next level</span>
              </div>
            </div>

            {/* Personalization Settings Button */}
            {onUpdatePreferences && profile.role === 'student' && (
              <div className="pt-4 border-t border-border">
                <Button
                  variant="outline"
                  className="gap-2 w-full"
                  onClick={() => setIsEditingPreferences(true)}
                >
                  <Sliders size={18} />
                  Personalization Settings
                </Button>
                {currentPreferences && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {THEMATIC_INTERESTS.find(i => i.value === currentPreferences.primaryInterest)?.label || 'Not set'}
                    {currentPreferences.secondaryInterest && (
                      <> + {THEMATIC_INTERESTS.find(i => i.value === currentPreferences.secondaryInterest)?.label}</>
                    )}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkle size={28} weight="fill" className="text-accent" />
          <h2 className="text-2xl font-bold">Artifact Collection</h2>
        </div>
        
        {profile.artifacts.length === 0 ? (
          <Card className="glass-panel p-12 text-center">
            <Star size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground mb-2">No artifacts yet</p>
            <p className="text-sm text-muted-foreground">
              Complete quests with high scores (90%+) to earn legendary artifacts
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className={`glass-panel p-6 border-2 hover:scale-105 transition-all cursor-pointer ${getRarityColor(artifact.rarity)}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <Sparkle size={24} weight="fill" className="text-accent" />
                    {getRarityBadge(artifact.rarity)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{artifact.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {artifact.description}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                      Earned {new Date(artifact.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {onUpdateAvatar && (
        <AvatarEditor
          open={isEditingAvatar}
          avatar={profile.avatar || DEFAULT_AVATAR}
          theme={theme}
          onClose={() => setIsEditingAvatar(false)}
          onSave={handleSaveAvatar}
        />
      )}

      {onUpdatePreferences && (
        <PreferencesModal
          open={isEditingPreferences}
          currentPreferences={currentPreferences}
          onClose={() => setIsEditingPreferences(false)}
          onSave={onUpdatePreferences}
        />
      )}
    </div>
  )
}
