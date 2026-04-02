// "use client";

// import * as React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { createTask } from "@/src/services/task.service";

// interface TeamMember {
//   _id: string;
//   name: string;
//   initials?: string;
// }

// interface Project {
//   _id: string;
//   name: string;
//   members?: { _id: string; name: string }[];
// }

// interface CreateTaskModalProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   projectId?: string;
//   teamMembers?: TeamMember[];
//   projects?: Project[];
//   onSuccess?: () => void;
// }

// export function CreateTaskModal({
//   open,
//   onOpenChange,
//   projectId,
//   teamMembers,
//   projects,
//   onSuccess,
// }: CreateTaskModalProps) {
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [title, setTitle] = React.useState("");
//   const [description, setDescription] = React.useState("");
//   const [priority, setPriority] = React.useState("medium");
//   const [assignee, setAssignee] = React.useState("");
//   const [dueDate, setDueDate] = React.useState("");
//   const [tags, setTags] = React.useState("");
//   // const [selectedProject, setSelectedProject] = React.useState(projectId || "");
//   // const [projectMembers, setProjectMembers] = React.useState<
//   //   { _id: string; name: string }[]
//   // >([]);
//   const projectMembers = teamMembers || [];

//   // Update team members when project changes
//   // React.useEffect(() => {
//   //   if (projects && selectedProject) {
//   //     const project = projects.find((p) => p._id === selectedProject);
//   //     if (project && project.members) {
//   //       const formattedMembers = project.members.map((m: any) => ({
//   //         _id: m.user._id,
//   //         name: m.user.name,
//   //       }));

//   //       setProjectMembers(formattedMembers);
//   //     } else {
//   //       setProjectMembers([]);
//   //     }
//   //   } else {
//   //     setProjectMembers([]);
//   //   }
//   // }, [selectedProject, projects]);

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setPriority("medium");
//     setAssignee("");
//     setDueDate("");
//     setTags("");
//     setSelectedProject(projectId || "");
//   };

//   // Set default project when modal opens
//   React.useEffect(() => {
//     if (open) {
//       setSelectedProject(projectId || "");
//     }
//   }, [open, projectId]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const projectToUse = projectId || selectedProject;
//     if (!title.trim() || !projectToUse) return;

//     setIsLoading(true);
//     try {
//       const taskData = {
//         title: title.trim(),
//         description: description.trim(),
//         project: projectToUse,
//         assignedTo: assignee || undefined,
//         priority,
//         dueDate: dueDate || undefined,
//         tags: tags
//           ? tags
//               .split(",")
//               .map((t) => t.trim())
//               .filter(Boolean)
//           : undefined,
//       };

//       await createTask(taskData);
//       resetForm();
//       onOpenChange(false);
//       if (onSuccess) {
//         onSuccess();
//       }
//     } catch (error) {
//       console.error("Failed to create task:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Create New Task</DialogTitle>
//           <DialogDescription>Add a new task to this project.</DialogDescription>
//         </DialogHeader>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Project Selector - Show when no projectId is provided and projects are available */}
//           {!projectId && projects && projects.length > 0 && (
//             <div className="space-y-2">
//               <Label htmlFor="project">Project</Label>
//               <Select
//                 value={selectedProject}
//                 onValueChange={setSelectedProject}
//               >
//                 <SelectTrigger id="project">
//                   <SelectValue placeholder="Select a project" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {projects.map((proj) => (
//                     <SelectItem key={proj._id} value={proj._id}>
//                       {proj.name}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           )}

//           <div className="space-y-2">
//             <Label htmlFor="title">Task Title</Label>
//             <Input
//               id="title"
//               placeholder="Enter task title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="description">Description</Label>
//             <Textarea
//               id="description"
//               placeholder="Describe the task..."
//               rows={3}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="priority">Priority</Label>
//               <Select value={priority} onValueChange={setPriority}>
//                 <SelectTrigger id="priority">
//                   <SelectValue placeholder="Select priority" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="low">Low</SelectItem>
//                   <SelectItem value="medium">Medium</SelectItem>
//                   <SelectItem value="high">High</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="assignee">Assignee</Label>
//               {projectMembers && projectMembers.length > 0 ? (
//                 <Select
//                   value={assignee || "unassigned"}
//                   onValueChange={(val) =>
//                     setAssignee(val === "unassigned" ? "" : val)
//                   }
//                 >
//                   <SelectTrigger id="assignee">
//                     <SelectValue placeholder="Select assignee" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="unassigned">Unassigned</SelectItem>
//                     {projectMembers.map((member) => (
//                       <SelectItem key={member._id} value={member._id}>
//                         {member.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               ) : (
//                 <Input
//                   id="assignee"
//                   placeholder="Assignee ID (optional)"
//                   value={assignee}
//                   onChange={(e) => setAssignee(e.target.value)}
//                 />
//               )}
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="dueDate">Due Date</Label>
//             <Input
//               id="dueDate"
//               type="date"
//               value={dueDate}
//               onChange={(e) => setDueDate(e.target.value)}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="tags">Tags (comma separated)</Label>
//             <Input
//               id="tags"
//               placeholder="design, frontend, urgent"
//               value={tags}
//               onChange={(e) => setTags(e.target.value)}
//             />
//           </div>

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Creating..." : "Create Task"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

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
import { createTask } from "@/src/services/task.service";

interface TeamMember {
  _id: string;
  name: string;
}

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string; // 🔥 required now
  teamMembers?: TeamMember[];
  onSuccess?: () => void;
}

export function CreateTaskModal({
  open,
  onOpenChange,
  projectId,
  teamMembers,
  onSuccess,
}: CreateTaskModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState("medium");
  const [assignee, setAssignee] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [tags, setTags] = React.useState("");

  // 🔥 use teamMembers directly
  const projectMembers = teamMembers || [];

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setAssignee("");
    setDueDate("");
    setTags("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !projectId) return;

    setIsLoading(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        project: projectId,
        assignedTo: assignee || undefined,
        priority,
        dueDate: dueDate || undefined,
        tags: tags
          ? tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean)
          : undefined,
      };

      await createTask(taskData);

      resetForm();
      onOpenChange(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task to this project.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label>Task Title</Label>
            <Input
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Describe the task..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Priority + Assignee */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Assignee */}
            <div className="space-y-2">
              <Label>Assignee</Label>

              {projectMembers?.length ? (
                <Select
                  value={assignee || "unassigned"}
                  onValueChange={(val) =>
                    setAssignee(val === "unassigned" ? "" : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>

                    {projectMembers.map((member) => (
                      <SelectItem key={member._id} value={member._id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No members available
                </p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <Input
              placeholder="design, frontend, urgent"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
