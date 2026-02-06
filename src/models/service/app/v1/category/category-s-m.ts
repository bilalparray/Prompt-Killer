import { PromptSM } from "../prompt/prompt-s-m";

export class CategorySM {
  id!: number;
  name!: string;
  slug!: string;
  description!: string;
  isActive!: boolean;
  imageBase64!: string;
  prompts!: PromptSM[];
  createdOnUTC!: Date;
  lastModifiedOnUTC!: Date;
  createdBy!: string;
  lastModifiedBy!: string;
}
