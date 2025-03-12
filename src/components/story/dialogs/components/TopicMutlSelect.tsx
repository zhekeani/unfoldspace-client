"use client";

import { X } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Topic } from "@/types/database.types";
import { Command as CommandPrimitive } from "cmdk";

interface TopicMultiSelectProps {
  availableTopics: Topic[];
  value: string[];
  onChange: (topics: string[]) => void;
}

const TopicMultiSelect = ({
  value,
  onChange,
  availableTopics,
}: TopicMultiSelectProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selected = availableTopics.filter((topic) => value.includes(topic.id));

  const handleUnselect = (topic: Topic) => {
    onChange(value.filter((t) => t !== topic.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current;
    if (input) {
      if ((e.key === "Delete" || e.key === "Backspace") && input.value === "") {
        onChange(value.slice(0, -1));
      }
      if (e.key === "Escape") {
        input.blur();
      }
    }
  };

  const isTopicListOpen = open && value.length < 5;
  const selectables = availableTopics.filter(
    (topic) => !value.includes(topic.id)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-3 text-sm focus-within:ring-gray-400 focus-within:ring-2 focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1 gap-y-2">
          {selected.map((topic) => (
            <Badge
              className="flex gap-2 py-[6px]"
              key={topic.id}
              variant="secondary"
            >
              <p className="font-normal text-xs-sm">{topic.name}</p>
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(topic)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          {value.length < 5 && (
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              placeholder="Select topics..."
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground h-[30px]"
            />
          )}
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {isTopicListOpen && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full max-h-40 overflow-y-scroll">
                {selectables.map((topic) => (
                  <CommandItem
                    key={topic.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      onChange([...value, topic.id]);
                    }}
                    className="cursor-pointer"
                  >
                    {topic.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
};

export default TopicMultiSelect;
