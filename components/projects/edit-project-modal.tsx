"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/src/lib/utils";
import { updateProject } from "@/src/services/project.service";
import { toast } from "sonner";

const colors = [
  { name: "Blue", value: "bg-blue-500" },
  { name: "Green", value: "bg-emerald-500" },
  { name: "Purple", value: "bg-purple-500" },
  { name: "Orange", value: "bg-orange-500" },
  { name: "Red", value: "bg-red-500" },
  { name: "Cyan", value: "bg-cyan-500" },
];

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  endDate: string;
  color: string;
}

interface EditProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
  onSuccess?: () => void;
}

export function EditProjectModal({
  open,
  onOpenChange,
  project,
  onSuccess,
}: EditProjectModalProps) {
  const [selectedColor, setSelectedColor] = React.useState(colors[0].value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    description: "",
    status: "active",
    endDate: "",
    color: colors[0].value,
  });

  // Populate form when project data is available
  React.useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        color: project.color || colors[0].value,
      });
      setSelectedColor(project.color || colors[0].value);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !project) return;

    try {
      setIsLoading(true);
      await updateProject(project._id, {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        startDate: formData.endDate,
        endDate: formData.endDate,
        color: formData.color,
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Project updated successfully!");
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your project details. Make changes to your project here.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
          
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Project Color</Label>
            <div className="flex items-center gap-2">
              {colors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => {
                    setSelectedColor(color.value);
                    setFormData({ ...formData, color: color.value });
                  }}
                  className={cn(
                    "h-8 w-8 rounded-full transition-all",
                    color.value,
                    selectedColor === color.value
                      ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      : "hover:scale-110",
                  )}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
