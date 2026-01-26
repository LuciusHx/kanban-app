export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'Baixa' | 'Média' | 'Alta';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormModel {
  title: string;
  description: string;
  priority: 'Baixa' | 'Média' | 'Alta';
}

export type TaskStatus = 'Backlog' | 'Em andamento' | 'Em revisão' | 'Concluído';
