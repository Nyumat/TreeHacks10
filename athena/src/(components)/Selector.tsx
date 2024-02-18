"use client";
import MultipleSelector, { Option } from "@/(components)/ui/multi-select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const OPTIONS: Option[] = [
  { label: "Video", value: "video" },
  { label: "Document", value: "document" },
  { label: "Image", value: "image" },
];

const parseInput = (value: Option[]) => {
  return value.map((val) => val.value);
};

const MultipleSelectorControlled = () => {
  const [value, setValue] = useState<Option[]>([]);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  return (
    <div className="flex w-full flex-col gap-8 px-10">
      <MultipleSelector
        className="w-1/2 h-12 text-2xl mx-auto rounded-lg"
        value={value}
        onChange={setValue}
        defaultOptions={OPTIONS}
        placeholder={!value.length ? "Select content type" : undefined}
        // TODO: address empty indicator bug
      />

      {value.length ? (
        <div className="block mx-auto justify-center">
          <Button
            className="w-32 text-center p-2 text-2xl hover:bg-purple-600"
            onClick={() => {
              if (value.length > 0) {
                router.push(`/upload/content?types=${parseInput(value)}`);
              } else {
                setError("Please select at least one content type");
              }
            }}
          >
            Next
          </Button>
        </div>
      ) : null}

      {error && (
        <p className="text-center text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default MultipleSelectorControlled;
