import { useMemo, memo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Theme, THEME_CONFIGS, UserProfile } from '@/lib/types'
import { Trophy, Medal, Star, Crown, Sparkle } from '@phosphor-icons/react'
import { calculateLevel, getLevelTitle } from '@/lib/game-utils'
import { motion } from 'framer-motion'
import { AvatarDisplay } from '@/components/AvatarDisplay'
import { DEFAULT_AVATAR } from '@/lib/avatar-options'

interface LeaderboardProps {
  profiles: UserProfile[]
  theme: Theme
  currentUserId: string
}

export const Leaderboard = memo(function Leaderboard({ profiles, theme, currentUserId }: LeaderboardProps) {
  const themeConfig = THEME_CONFIGS[theme]

  // Memoize sorted profiles to prevent re-sorting on every render
  const sortedProfiles = useMemo(
    () => [...profiles].sort((a, b) => b.xp - a.xp),
    [profiles]
  )

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={28} weight="fill" className="text-accent" />
    if (rank === 2) return <Medal size={24} weight="fill" className="text-muted-foreground" />
    if (rank === 3) return <Medal size={24} weight="fill" className="text-destructive" />
    return <Star size={20} className="text-muted-foreground" />
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'border-accent bg-accent/10 shadow-lg shadow-accent/20'
    if (rank === 2) return 'border-muted-foreground/50 bg-muted-foreground/5'
    if (rank === 3) return 'border-destructive/50 bg-destructive/5'
    return 'border-border'
  }

  return (
    <div className="space-y-6 p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <Trophy size={32} weight="fill" className="text-accent" />
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground">Top heroes ranked by {themeConfig.xpLabel}</p>
        </div>
      </div>

      {sortedProfiles.length === 0 ? (
        <Card className="glass-panel p-12 text-center">
          <Trophy size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg text-muted-foreground">No heroes yet</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedProfiles.map((profile, index) => {
            const rank = index + 1
            const level = calculateLevel(profile.xp)
            const levelTitle = getLevelTitle(level, profile.role)
            const isCurrentUser = profile.id === currentUserId

            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 100 }}
              >
                <Card
                  className={`glass-panel p-6 border-2 transition-all hover:scale-[1.02] ${getRankColor(rank)} ${
                    isCurrentUser ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className="flex items-center justify-center w-12">
                      {rank <= 3 ? (
                        <motion.div
                          animate={rank === 1 ? {
                            rotate: [0, -10, 10, -10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: rank === 1 ? Infinity : 0,
                            repeatDelay: 3
                          }}
                        >
                          {getRankIcon(rank)}
                        </motion.div>
                      ) : (
                        <span className="text-2xl font-bold text-muted-foreground">#{rank}</span>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-16 h-16 border-2 border-primary rounded-full overflow-hidden bg-card">
                        <AvatarDisplay 
                          avatar={profile.avatar || DEFAULT_AVATAR} 
                          size="md"
                        />
                      </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate">{profile.name}</h3>
                        {isCurrentUser && (
                          <Badge variant="default" className="text-xs gap-1">
                            <Sparkle size={12} weight="fill" />
                            You
                          </Badge>
                        )}
                        {rank === 1 && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              Champion
                            </Badge>
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Level {level}</span>
                        <span>•</span>
                        <span>{levelTitle}</span>
                        {profile.artifacts.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Sparkle size={12} weight="fill" className="text-accent" />
                              {profile.artifacts.length}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-accent">{profile.xp}</div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wide">
                        {themeConfig.xpLabel}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
})
