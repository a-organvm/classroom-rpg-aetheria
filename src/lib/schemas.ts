import { z } from 'zod';

export const ThemeSchema = z.enum(['fantasy', 'scifi', 'medieval', 'modern']);

export const RealmSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  color: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
  }).optional(),
  createdAt: z.number(),
});

export const QuestTypeSchema = z.enum(['standard', 'boss', 'redemption']);
export const QuestStatusSchema = z.enum(['locked', 'available', 'in_progress', 'completed', 'failed']);

export const QuestSchema = z.object({
  id: z.string(),
  realmId: z.string(),
  name: z.string(),
  description: z.string(),
  type: QuestTypeSchema,
  xpValue: z.number(),
  dueDate: z.number().optional(),
  status: QuestStatusSchema,
  prerequisiteIds: z.array(z.string()).optional(),
  createdAt: z.number(),
});

export const ExportPackageSchema = z.object({
  version: z.string(),
  exportedAt: z.number(),
  realms: z.array(RealmSchema),
  quests: z.array(QuestSchema),
  theme: ThemeSchema,
});

// LLM response schemas for quest evaluation
export const EvaluationResponseSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
});

export const RedemptionQuestSchema = z.object({
  name: z.string(),
  description: z.string(),
});
