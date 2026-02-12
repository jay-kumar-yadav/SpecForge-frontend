import { useState, useRef, useEffect } from 'react';
import {  Draggable } from "@hello-pangea/dnd";

import { useSpec } from '../context/SpecContext';

export default function TaskCard({ task, groupId, index }) {
  const { updateTaskText, deleteTask, toggleTaskComplete } = useSpec();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(task.text);
  }, [task.text]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = () => {
    setEditing(false);
    if (text.trim() !== task.text) {
      updateTaskText(groupId, task.id, text.trim() || task.text);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.target.blur();
    }
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`group flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm hover:shadow-md transition-shadow ${snapshot.isDragging ? 'shadow-lg ring-2 ring-amber-500' : ''}`}
    >
      <div {...provided.dragHandleProps} className="mt-1 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <path d="M3 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM3 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm5 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
      </div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTaskComplete(groupId, task.id)}
        className="mt-1.5 rounded border-zinc-300 dark:border-zinc-600 text-amber-500 focus:ring-amber-500"
      />
      <div className="flex-1 min-w-0">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full px-2 py-1 text-sm rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
          />
        ) : (
          <span
            onDoubleClick={() => setEditing(true)}
            className={`text-sm text-zinc-700 dark:text-zinc-300 cursor-text block py-0.5 ${task.completed ? 'line-through opacity-70' : ''}`}
          >
            {task.text || 'Empty task'}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={() => deleteTask(groupId, task.id)}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1.5 sm:p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all touch-manipulation"
        aria-label="Delete task"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
      )}
    </Draggable>
  );
}
