import { Todo } from './todo.type';

let todos: Todo[] = [];

const cloneTodos = () => {
  return todos.map(todo => ({ ...todo }));
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  getTodos: async (): Promise<Todo[]> => {
    console.log(todos, 11111111);
    await sleep(3000);
    return cloneTodos().map(todo => ({ ...todo, loading: false }));
  },

  addTodo: async (todo: Todo): Promise<Todo> => {
    await sleep(2000);
    const data = { ...todo, loading: false };
    todos.push(data);
    return data;
  },

  updateTodo: async (id: string, updates: Partial<Todo>): Promise<Todo> => {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updates };
      await sleep(2000);
      return todos[index];
    }
    throw new Error('Todo not found');
  },

  deleteTodo: async (id: string): Promise<void> => {
    todos = todos.filter(todo => todo.id !== id);
    await sleep(2000);
  },
};
