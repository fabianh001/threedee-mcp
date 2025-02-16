import React, { useEffect, useRef, useState } from "react";
import { Plus, LightbulbIcon } from "lucide-react";
import TextField from "./TextField";

import { ContextMenu } from "./ContextMenu";

interface ChatInputProps {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: (value: string) => void;
}

export const ChatInput: React.FunctionComponent<ChatInputProps> = ({
  inputValue,
  setInputValue,
  onSubmit,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  // const [inputValue, setInputValue] = useState<string>("");
  const [isContextMenuOpen, setIsContextMenuOpen] = useState<boolean>(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const input = !selectedAttributes ? inputValue : inputValue + " Following attributes used: " + selectedAttributes;
      onSubmit(input);
      // alert(inputValue + " Following attributes used: " + selectedAttributes);
      setInputValue("");
    }
  };

  const closeContextMenu = () => {
    setIsContextMenuOpen(false);
  };

  const toggleContextMenu = () => {
    setIsContextMenuOpen((prev) => !prev);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 fixed bottom-0 left-0 right-0 flex justify-center gap-8 items-end">
      <div className="w-2/3 rounded-lg ">
        <div className="rounded-full border bg-white px-3 py-2 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask Pinthouse"
            className="flex-1 bg-transparent border-0 focus:outline-none text-gray-900 placeholder:text-gray-500 text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="border inline-flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full text-gray-600 text-sm transition-colors">
            <LightbulbIcon className="h-5 w-5 text-gray-600" />
            Add Image
          </button>

          <div className="flex gap-2 items-center">
            <button
              onClick={toggleContextMenu}
              className="border inline-flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-full text-gray-600 text-sm transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Attributes
            </button>
          </div>
        </div>

        {isContextMenuOpen && (
          <ContextMenu
            selectedAttributes={selectedAttributes}
            setSelectedAttributes={setSelectedAttributes}
            closeMenu={closeContextMenu}
          />
        )}
      </div>
      <TextField content="" />
    </div>
  );
};
