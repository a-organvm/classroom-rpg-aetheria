/**
 * Variant Preview Component
 *
 * Preview all thematic variants for a quest side by side.
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { ThematicVariant, ThematicInterest } from '@/lib/types'
import { Eye, ExternalLink, Copy, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface VariantPreviewProps {
  questName: string
  variants: ThematicVariant[]
  className?: string
}

const INTEREST_COLORS: Record<ThematicInterest, string> = {
  sports: 'bg-orange-500',
  science: 'bg-blue-500',
  arts: 'bg-purple-500',
  technology: 'bg-cyan-500',
  nature: 'bg-green-500',
  'social-justice': 'bg-rose-500',
  business: 'bg-amber-500',
  general: 'bg-gray-500'
}

const INTEREST_EMOJIS: Record<ThematicInterest, string> = {
  sports: '⚽',
  science: '🔬',
  arts: '🎨',
  technology: '💻',
  nature: '🌿',
  'social-justice': '✊',
  business: '📊',
  general: '📚'
}

export function VariantPreview({ questName, variants, className }: VariantPreviewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string>(variants[0]?.interestArea || '')

  const handleCopy = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedId(id)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (variants.length === 0) {
    return (
      <Card className={cn('glass-panel', className)}>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Eye size={32} className="mx-auto mb-2 opacity-50" />
          <p>No variants to preview</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('glass-panel', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye size={20} />
            <CardTitle className="text-lg">Preview: {questName}</CardTitle>
          </div>
          <Badge variant="secondary">{variants.length} variants</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={selectedVariant} onValueChange={setSelectedVariant}>
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
            {variants.map(variant => (
              <TabsTrigger
                key={variant.id}
                value={variant.interestArea}
                className="gap-1 data-[state=active]:shadow-sm"
              >
                <span>{INTEREST_EMOJIS[variant.interestArea]}</span>
                <span className="hidden sm:inline capitalize">
                  {variant.interestArea.replace('-', ' ')}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {variants.map(variant => (
            <TabsContent
              key={variant.id}
              value={variant.interestArea}
              className="mt-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        'w-3 h-3 rounded-full',
                        INTEREST_COLORS[variant.interestArea]
                      )} />
                      <h3 className="font-semibold">{variant.title}</h3>
                    </div>
                    {variant.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {variant.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCopy(variant.content, variant.id)}
                  >
                    {copiedId === variant.id ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} />
                    )}
                  </Button>
                </div>

                {/* Content */}
                <Card className="bg-muted/50">
                  <ScrollArea className="h-[300px]">
                    <CardContent className="pt-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {variant.content.split('\n').map((paragraph, i) => (
                          <p key={i}>{paragraph}</p>
                        ))}
                      </div>
                    </CardContent>
                  </ScrollArea>
                </Card>

                {/* Resources */}
                {variant.resources && variant.resources.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Resources</h4>
                    <div className="flex flex-wrap gap-2">
                      {variant.resources.map((resource, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => window.open(resource, '_blank')}
                        >
                          <ExternalLink size={12} />
                          Resource {i + 1}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
