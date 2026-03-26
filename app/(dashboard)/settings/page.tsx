"use client";

import * as React from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Key, Bell, Shield, Palette, Globe, Users } from "lucide-react";
import { useUser } from "@/src/contexts/user-context";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { user, loading, isAdmin } = useUser();

  // Guard: don't render during SSG when user is not available
  if (!user && !loading) {
    return null;
  }

  const userName = user?.name || "";
  const userAvatar = user?.avatar || "";
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
  const firstName = user?.name?.split(" ")[0] || "";
  const lastName = user?.name?.split(" ")[1] || "";
  const userEmail = user?.email || "";

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6 max-w-4xl">
        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={isAdmin ? "default" : "secondary"} className="gap-1">
            {isAdmin ? (
              <Shield className="h-3 w-3" />
            ) : (
              <Users className="h-3 w-3" />
            )}
            {isAdmin ? "Admin Account" : "Member Account"}
          </Badge>
          {!isAdmin && (
            <span className="text-sm text-muted-foreground">
              Some settings are only available to admins
            </span>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={userAvatar} alt="Profile" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Profile Photo
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      JPG, GIF or PNG. Max size 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={firstName}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={lastName || ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={userEmail} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="flex">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                      nexus.dev/
                    </span>
                    <Input
                      id="username"
                      defaultValue={userName.toLowerCase().replace(" ", "")}
                      className="rounded-l-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us a little about yourself..."
                    defaultValue={
                      isAdmin
                        ? "Team administrator and project lead."
                        : "Team member contributing to projects."
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue={isAdmin ? "Admin" : "Member"}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    {isAdmin
                      ? "You have full administrative access."
                      : "Contact an admin to change your role."}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Password</CardTitle>
                </div>
                <CardDescription>
                  Change your password to keep your account secure.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Preferences</CardTitle>
                </div>
                <CardDescription>
                  Set your language and timezone preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="ja">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="pst">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  {isAdmin
                    ? "Permanently delete your account and all associated data."
                    : "Request account deletion from an administrator."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <Button variant="destructive">Delete Account</Button>
                ) : (
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive"
                  >
                    Request Account Deletion
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Email Notifications</CardTitle>
                </div>
                <CardDescription>
                  Choose what email notifications you receive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    id: "tasks",
                    label: "Task assignments",
                    description: "Get notified when you're assigned to a task",
                    default: true,
                  },
                  {
                    id: "comments",
                    label: "Comments and mentions",
                    description: "Get notified when someone mentions you",
                    default: true,
                  },
                  {
                    id: "projects",
                    label: "Project updates",
                    description: "Get notified about project status changes",
                    default: true,
                  },
                  {
                    id: "team",
                    label: "Team activity",
                    description: "Get notified when team members join or leave",
                    default: false,
                  },
                  {
                    id: "marketing",
                    label: "Marketing emails",
                    description: "Receive product updates and newsletters",
                    default: false,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id} className="text-base">
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Configure browser push notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    id: "push-tasks",
                    label: "Task reminders",
                    description: "Get reminded about upcoming deadlines",
                    default: true,
                  },
                  {
                    id: "push-chat",
                    label: "Chat messages",
                    description: "Get notified about new messages",
                    default: true,
                  },
                  {
                    id: "push-mentions",
                    label: "Direct mentions",
                    description: "Get notified when mentioned in comments",
                    default: true,
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id} className="text-base">
                        {item.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch id={item.id} defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Theme</CardTitle>
                </div>
                <CardDescription>
                  Customize the look and feel of the application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Color Mode</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "light", label: "Light" },
                      { value: "dark", label: "Dark" },
                      { value: "system", label: "System" },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        className="flex flex-col items-center gap-2 rounded-lg border-2 border-border p-4 hover:border-primary focus:border-primary focus:outline-none"
                      >
                        <div
                          className={`h-8 w-8 rounded-full ${
                            theme.value === "light"
                              ? "bg-white border border-border"
                              : theme.value === "dark"
                                ? "bg-gray-900"
                                : "bg-gradient-to-r from-white to-gray-900"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {theme.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-3">
                    {[
                      "bg-emerald-500",
                      "bg-blue-500",
                      "bg-purple-500",
                      "bg-pink-500",
                      "bg-orange-500",
                    ].map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full ${color} ring-offset-2 ring-offset-background hover:ring-2 hover:ring-primary focus:ring-2 focus:ring-primary`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  <CardTitle>Two-Factor Authentication</CardTitle>
                </div>
                <CardDescription>
                  Add an extra layer of security to your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      Authenticator App
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use an authenticator app to generate codes
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">
                      SMS Authentication
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Receive codes via SMS
                    </p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions across devices.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    device: "MacBook Pro",
                    location: "San Francisco, CA",
                    current: true,
                  },
                  {
                    device: "iPhone 15",
                    location: "San Francisco, CA",
                    current: false,
                  },
                  {
                    device: "Windows PC",
                    location: "New York, NY",
                    current: false,
                  },
                ].map((session, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">
                        {session.device}
                        {session.current && (
                          <span className="ml-2 text-xs text-primary">
                            (Current)
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.location}
                      </p>
                    </div>
                    {!session.current && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
