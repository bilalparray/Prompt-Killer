import { PromptTypeSM } from "@/models/enums/prompt-type-s-m.enum";
import { PromptSampleSM } from "./prompt-sample-s-m";

export class PromptSM {
  id!: number;
  categoryId!: number;
  title!: string;
  description!: string;
  promptText!: string;
  promptType!: PromptTypeSM;
  bestForAITools!: string;
  isTrending!: boolean;
  likesCount!: number;
  isActive!: boolean;
  samples!: PromptSampleSM[];
  createdOnUTC!: Date;
  lastModifiedOnUTC!: Date;
  createdBy!: string;
  lastModifiedBy!: string;
}
