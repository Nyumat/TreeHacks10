"use client";
import MultipleSelector, { Option } from "@/(components)/ui/multi-select";
import { useState } from "react";

const OPTIONS: Option[] = [
  { label: "Video", value: "video" },
  { label: "Document", value: "document" },
  { label: "Image", value: "image" },
];

const MultipleSelectorControlled = () => {
  const [value, setValue] = useState<Option[]>([]);
  return (
    <div className="flex w-full flex-col gap-5 px-10">
      <p className="text-primary">
        Your selection: {value.map((val) => val.label).join(", ")}
      </p>
      <MultipleSelector
        value={value}
        onChange={setValue}
        defaultOptions={OPTIONS}
        placeholder="Select frameworks you like..."
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default MultipleSelectorControlled;
