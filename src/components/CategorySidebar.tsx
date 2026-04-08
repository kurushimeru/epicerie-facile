"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories } from "@/data/mockData";

interface CategorySidebarProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
}

export function CategorySidebar({ selectedCategories, onCategoryChange }: CategorySidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter((c) => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <>
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r shadow-lg transition-transform duration-300 z-30 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "250px" }}
      >
        <div className="p-4 border-b">
          <h2 className="font-semibold">Catégories</h2>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => toggle(category)}
                />
                <label htmlFor={category} className="text-sm cursor-pointer leading-none">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-10 top-4 bg-white border shadow-md rounded-l-none"
          onClick={() => setIsOpen(false)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-0 top-20 bg-white border shadow-md rounded-l-none z-30"
          onClick={() => setIsOpen(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
