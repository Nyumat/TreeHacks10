"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { Input } from "@/(components)/ui/input";
import { Label } from "@/(components)/ui/label";

import Image from "next/image";

export default function Page() {
  const searchParams = useSearchParams();

  const contentTypes = searchParams.get("types");

  const [selectedFile, setSelectedFile] = useState<string | ArrayBuffer | null>(
    null
  );

  if (contentTypes === null) {
    return null;
  }

  const contentTypesArray = contentTypes.split(",");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) {
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="grid place-items-center gap-4 h-full mt-24">
      {contentTypesArray.map((type) => {
        if (type === "video") {
          return (
            <div key={type} className="flex flex-col items-center gap-4">
              <Label htmlFor="video" className="text-2xl">
                Upload a video
              </Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
              />
            </div>
          );
        } else if (type === "image") {
          return (
            <div key={type} className="flex flex-col items-center gap-4">
              <Label htmlFor="image" className="text-2xl">
                Upload an image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          );
        } else if (type === "document") {
          return (
            <div key={type} className="flex flex-col items-center gap-4">
              <Label htmlFor="document" className="text-2xl">
                Upload a document
              </Label>
              <Input
                id="document"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          );
        }
      })}

      {selectedFile && (
        <div className="flex flex-col items-center gap-4">
          <Label htmlFor="preview" className="text-2xl">
            Preview
          </Label>
          <Image
            src={selectedFile as string}
            alt="Preview"
            width={300}
            height={300}
          />
        </div>
      )}
    </div>
  );
}
