import { useState, useEffect } from 'react';
import { Todo, TodoFilter } from './todo.type';
import { api } from './api';
import { TodoItem } from './TodoItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    console.log('111');
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const fetchedTodos = await api.getTodos();
    setTodos(fetchedTodos);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() && !isAdding) {
      setIsAdding(true);
      try {
        const todo = await api.addTodo(newTodo);
        setTodos(prevTodos => [...prevTodos, todo]);
        setNewTodo('');
        setFilter('all'); // Switch to "all" tab when adding a new todo
      } catch (error) {
        console.error('Failed to add todo:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = await api.updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => (t.id === id ? updatedTodo : t)));
    }
  };

  const deleteTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await api.updateTodo(id, { deleted: true });
      setTodos(todos.map(t => (t.id === id ? { ...t, deleted: true } : t)));
    }
  };

  const restoreTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await api.updateTodo(id, { deleted: false });
      setTodos(todos.map(t => (t.id === id ? { ...t, deleted: false } : t)));
    }
  };

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed && !todo.deleted;
      case 'completed':
        return todo.completed && !todo.deleted;
      case 'deleted':
        return todo.deleted;
      default:
        return !todo.deleted;
    }
  });

  console.log('222222', todos.length);

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={addTodo} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="添加新的待办事项..."
          className="flex-grow"
          disabled={isAdding}
        />
        <Button type="submit" disabled={isAdding}>
          <PlusCircle className="w-4 h-4 mr-2" />
          添加
        </Button>
      </form>

      <Tabs value={filter} onValueChange={value => setFilter(value as TodoFilter)} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="active">未完成</TabsTrigger>
          <TabsTrigger value="completed">已完成</TabsTrigger>
          <TabsTrigger value="deleted">已删除</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} onRestore={restoreTodo} />
        ))}
      </div>
    </div>
  );
}
