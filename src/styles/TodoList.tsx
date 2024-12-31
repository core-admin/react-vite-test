import { useState, useEffect, useOptimistic, useTransition } from 'react';
import { Todo, TodoFilter } from './todo.type';
import { api } from './api';
import { TodoItem } from './TodoItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';

export function TodoList() {
  /**
   * 注意：useOptimistic 需要在 transition 或 action 中使用
   */
  const [optimisticTodos, setOptimisticTodos] = useOptimistic<Todo[], Todo[]>([], (_, optimisticValue) => {
    console.log('optimisticValue >>', optimisticValue);
    return optimisticValue;
  });

  const [, startTransition] = useTransition();
  const [todoValue, setTodoValue] = useState('');
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const fetchedTodos = await api.getTodos();
    startTransition(() => setOptimisticTodos(fetchedTodos));
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (todoValue.trim() && !isAdding) {
      setIsAdding(true);
      try {
        const todo: Todo = {
          id: crypto.randomUUID(),
          text: todoValue,
          completed: false,
          deleted: false,
          loading: true,
        };

        startTransition(() => setOptimisticTodos([...optimisticTodos, todo]));
        await api.addTodo(todo);
        setTodoValue('');
        // setFilter('all'); // Switch to "all" tab when adding a new todo
      } catch (error) {
        console.error('Failed to add todo:', error);
      } finally {
        setIsAdding(false);
      }
      fetchTodos();
    }
  };

  const toggleTodo = async (id: string) => {
    let todo = optimisticTodos.find(t => t.id === id);
    if (todo) {
      todo = {
        ...todo,
        loading: true,
      };

      startTransition(() => setOptimisticTodos(optimisticTodos.map(t => (t.id === id ? todo! : t))));

      await api.updateTodo(id, { completed: !todo.completed });
      fetchTodos();
    }
  };

  const deleteTodo = async (id: string) => {
    const todo = optimisticTodos.find(t => t.id === id);
    if (todo) {
      setOptimisticTodos(optimisticTodos.map(t => (t.id === id ? { ...t, deleted: true } : t)));
      await api.updateTodo(id, { deleted: true });
      fetchTodos();
    }
  };

  const restoreTodo = async (id: string) => {
    const todo = optimisticTodos.find(t => t.id === id);
    if (todo) {
      startTransition(() =>
        setOptimisticTodos(optimisticTodos.map(t => (t.id === id ? { ...t, deleted: false, loading: true } : t))),
      );

      await api.updateTodo(id, { deleted: false });
      fetchTodos();
    }
  };

  const filteredTodos = optimisticTodos.filter(todo => {
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

  console.log('filteredTodos >>>>>>>>>>>>>', optimisticTodos, filteredTodos);

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={addTodo} className="flex space-x-2 mb-4">
        <Input
          type="text"
          value={todoValue}
          onChange={e => setTodoValue(e.target.value)}
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
