import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";

export class TrendingPromptSM {
  id!: number;
  title!: string;
  description!: string;
  promptText!: string;
  promptType!: PromptTypeSM;
  bestForAITools!: string;
  isActive!: boolean;
  likesCount!: number;
  createdOnUTC!: Date;
  lastModifiedOnUTC!: Date;
  createdBy!: string;
  lastModifiedBy!: string;
}
