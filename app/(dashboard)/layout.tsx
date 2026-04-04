import { UserProvider } from "@/src/contexts/user-context";
import { ProjectProvider } from "@/src/contexts/project-context";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </UserProvider>
  );
}
