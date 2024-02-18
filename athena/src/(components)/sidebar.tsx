"use client";
/**
 * https://v0.dev/t/qjSdwObcFDg (we love v0!)
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/(components)/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import FileInput from "./FileInput";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
const links = [
  {
    href: "/home",
    title: "Home",
  },
  {
    href: "/profile",
    title: "Profile",
  },
];

export default function Sidebar() {
  const user = useAuth();
  return (
    <header className="flex items-center h-16 px-4 border-b gap-4 w-full md:px-6">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Upload New Documents Today.</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Add new content to be stored and parsed
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Name of the content
              </Label>
              <Input
                id="content"
                value="Math Lecture Video"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <FileInput />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="ml-auto flex items-center gap-4"></div>
    </header>
  );
}
