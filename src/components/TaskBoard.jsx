import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { useSpec } from '../context/SpecContext';

const TASK_GROUPS = [
  { id: 'frontend', title: 'Frontend' },
  { id: 'backend', title: 'Backend' },
  { id: 'database', title: 'Database' },
  { id: 'testing', title: 'Testing' },
  { id: 'devops', title: 'DevOps' },
];

export default function TaskBoard() {
  const { currentSpec, reorderTasks, moveTask } = useSpec();

  if (!currentSpec?.tasks) return null;

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      const tasks = [...(currentSpec.tasks[source.droppableId] || [])];
      const [removed] = tasks.splice(source.index, 1);
      tasks.splice(destination.index, 0, removed);
      reorderTasks(source.droppableId, tasks);
    } else {
      moveTask(source.droppableId, destination.droppableId, source.index, destination.index);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-2 sm:mx-0 px-2 sm:px-0 snap-x snap-mandatory scroll-smooth">
        {TASK_GROUPS.map((group) => (
          <TaskColumn
            key={group.id}
            groupId={group.id}
            title={group.title}
            tasks={currentSpec.tasks[group.id] || []}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
