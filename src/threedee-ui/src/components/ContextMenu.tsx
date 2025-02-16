import { attributes } from "./constants";
import React, { useEffect, useRef } from "react";

interface ContextMenuProps {
  selectedAttributes: string[];
  setSelectedAttributes: React.Dispatch<React.SetStateAction<string[]>>;
  closeMenu: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  selectedAttributes,
  setSelectedAttributes,
  closeMenu,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSelection = (item: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <div
      ref={menuRef}
      className="absolute z-10 w-80 bg-white rounded-xl shadow-lg p-1 border"
      style={{ bottom: "60px", left: "450px" }}
    >
      {attributes.map((att) => (
        <div
          key={att}
          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          <label className="flex items-center gap-3 w-full cursor-pointer">
            <div className="flex items-center justify-center w-5 h-5">
              <input
                type="checkbox"
                checked={selectedAttributes.includes(att)}
                onChange={() => toggleSelection(att)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <span className="text-sm">{att}</span>
          </label>
        </div>
      ))}
    </div>
  );
};
