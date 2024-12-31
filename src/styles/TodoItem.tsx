import { Todo } from './todo.type';
import { Button } from '@/components/ui/button';
import { Trash, Undo, CheckCircle, Circle, LoaderIcon } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onRestore }: TodoItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-4 ${
        todo.deleted ? 'bg-red-100' : 'bg-white'
      } rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-md`}
      data-id={todo.id}
    >
      <div className="flex items-center space-x-3 flex-grow">
        {todo.loading ? (
          <Button variant="ghost" size="icon">
            <LoaderIcon className="h-5 w-5 text-gray-400 animate-spin" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={() => onToggle(todo.id)} disabled={todo.deleted}>
            {todo.completed ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </Button>
        )}

        <span
          className={`${todo.completed && !todo.deleted ? 'line-through text-gray-500' : ''} ${
            todo.deleted ? 'text-red-500' : ''
          } text-lg`}
        >
          {todo.text}
        </span>
      </div>
      {todo.deleted ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRestore(todo.id)}
          className="text-blue-500 hover:text-blue-700"
        >
          <Undo className="h-4 w-4 mr-1" />
          恢复
        </Button>
      ) : (
        <Button variant="ghost" size="sm" onClick={() => onDelete(todo.id)} className="text-red-500 hover:text-red-700">
          <Trash className="h-4 w-4 mr-1" />
          删除
        </Button>
      )}
    </div>
  );
}
