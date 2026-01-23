export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'Backlog' | 'Em andamento' | 'Em revisão' | 'Concluído';
