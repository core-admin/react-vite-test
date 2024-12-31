export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deleted: boolean;
  loading?: boolean;
}

export type TodoFilter = 'all' | 'active' | 'completed' | 'deleted';
