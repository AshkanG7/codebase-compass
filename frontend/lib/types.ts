export type User = {
  id: number;
  email: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
};

export type AuthResponse = {
  detail: string;
  user: User;
};

export type Project = {
  id: number;
  user_id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CodeFile = {
  id: number;
  project_id: number;
  path: string;
  language: string | null;
  extension: string;
  size_bytes: number;
  content: string;
  created_at: string;
};

export type ImportantFile = {
  path: string;
  reason: string;
  what_it_does: string;
};

export type RiskyPart = {
  issue: string;
  why_it_matters: string;
  suggestion: string;
};

export type FirstFileToRead = {
  path: string;
  reason: string;
};

export type Analysis = {
  id: number;
  project_id: number;
  status: string;
  summary: string | null;
  detected_stack: string[] | null;
  architecture: string | null;
  important_files: ImportantFile[] | null;
  how_to_run: string | null;
  data_flow: string | null;
  risky_or_confusing_parts: RiskyPart[] | null;
  first_files_to_read: FirstFileToRead[] | null;
  suggested_next_steps: string[] | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectDetail = Project & {
  files: CodeFile[];
  latest_analysis: Analysis | null;
};

export type PaginatedProjects = {
  items: Project[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type Question = {
  id: number;
  project_id: number;
  user_id: number;
  analysis_id: number | null;
  question: string;
  answer: string | null;
  created_at: string;
};

export type PaginatedQuestions = {
  items: Question[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type FileDraft = {
  path: string;
  language: string;
  content: string;
};
