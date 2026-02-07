export class PromptImageSM {
  id!: number;
  promptId!: number | null;
  trendingPromptId!: number | null;
  imageBase64!: string;
  description!: string;
  isActive!: boolean;
  createdOnUTC!: Date;
  lastModifiedOnUTC!: Date | null;
  createdBy!: string | null;
  lastModifiedBy!: string | null;
}
