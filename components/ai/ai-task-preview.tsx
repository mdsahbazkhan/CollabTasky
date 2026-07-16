"use client";

import * as React from "react";
import { Sparkles, ListTodo } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/src/lib/utils";
import { createTask } from "@/src/services/task.service";
import { toast } from "sonner";

interface Task {
  title: string;
  description: string;
  priority: string;
  status: string;
}

interface Props {
  projectId: string;
  tasks: Task[];
  onCreate?: (selectedTasks: Task[]) => void;
  onDiscard?: () => void;
}

const priorityStyles: Record<string, string> = {
  high: "border-red-200 bg-red-100 text-red-700 dark:border-red-900/50 dark:bg-red-900/30 dark:text-red-400",
  medium:
    "border-yellow-200 bg-yellow-100 text-yellow-700 dark:border-yellow-900/50 dark:bg-yellow-900/30 dark:text-yellow-400",
  low: "border-green-200 bg-green-100 text-green-700 dark:border-green-900/50 dark:bg-green-900/30 dark:text-green-400",
};

export default function AITaskPreview({
  projectId,
  tasks,
  onCreate,
  onDiscard,
}: Props) {
  const [selected, setSelected] = React.useState<boolean[]>(() =>
    tasks.map(() => true),
  );
  const [isCreating, setIsCreating] = React.useState(false);

  const selectedCount = selected.filter(Boolean).length;
  const allSelected = selectedCount === tasks.length && tasks.length > 0;

  const toggleTask = (index: number) => {
    setSelected((prev) =>
      prev.map((value, i) => (i === index ? !value : value)),
    );
  };

  const toggleAll = () => {
    setSelected(tasks.map(() => !allSelected));
  };

  const handleCreate = async () => {
    const selectedTasks = tasks.filter((_, i) => selected[i]);
    if (selectedTasks.length === 0 || isCreating) return;

    setIsCreating(true);
    try {
      for (const task of selectedTasks) {
        await createTask({
          title: task.title,
          description: task.description,
          priority: task.priority,
          project: projectId,
        });
      }

      toast.success(
        `${selectedTasks.length} task${selectedTasks.length === 1 ? "" : "s"} created successfully`,
      );
      onCreate?.(selectedTasks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create tasks. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex max-h-128 flex-col overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 shrink-0 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              AI Task Suggestions
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, edit or deselect tasks before adding them to this project.
          </p>
        </div>
        {tasks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={toggleAll}
          >
            {allSelected ? "Deselect all" : "Select all"}
          </Button>
        )}
      </div>

      {/* Task list */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {tasks.map((task, index) => {
          const priorityKey = task.priority?.toLowerCase();
          const isSelected = selected[index];
          return (
            <Card
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => toggleTask(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTask(index);
                }
              }}
              className={cn(
                "cursor-pointer rounded-xl border shadow-sm transition-all duration-200",
                "hover:-translate-y-0.5 hover:shadow-md",
                "animate-in fade-in slide-in-from-bottom-1 duration-300",
                isSelected
                  ? "border-primary/50 ring-1 ring-primary/30"
                  : "border-border opacity-60",
              )}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleTask(index)}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                  aria-label={`Select task: ${task.title}`}
                />
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <ListTodo className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h3 className="font-semibold leading-tight text-foreground">
                    {task.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {task.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize",
                        priorityStyles[priorityKey] ?? priorityStyles.low,
                      )}
                    >
                      {task.priority}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {task.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex flex-col gap-2 rounded-b-xl border-t border-border bg-card/95 px-5 py-3 backdrop-blur supports-backdrop-filter:bg-card/80 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedCount} of {tasks.length}{" "}
          {tasks.length === 1 ? "task" : "tasks"} selected
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDiscard}
            disabled={isCreating}
          >
            Discard
          </Button>
          <Button
            size="sm"
            disabled={selectedCount === 0 || isCreating}
            onClick={handleCreate}
          >
            {isCreating
              ? "Creating..."
              : `Create ${selectedCount > 0 ? selectedCount : ""} Task${selectedCount === 1 ? "" : "s"}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
