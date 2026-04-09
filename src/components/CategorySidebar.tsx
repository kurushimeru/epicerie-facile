"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORIES } from "@/lib/constants";
import { useAppContext } from "@/context/app-context";

export function CategorySidebar() {
  const { selectedCategories, setSelectedCategories } = useAppContext();
  const [isOpen, setIsOpen] = useState(true);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => setHeaderHeight(header.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  const toggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`fixed left-0 bg-white border-r shadow-lg transition-transform duration-300 z-30 w-[250px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ top: headerHeight, height: `calc(100vh - ${headerHeight}px)` }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Catégories</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="p-4 space-y-3">
            {CATEGORIES.map((category) => (
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
      </div>

      {/* Open button — anchored just below the header */}
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-0 z-30 bg-white border-r border-b shadow-md rounded-none rounded-br-md"
          style={{ top: headerHeight }}
          onClick={() => setIsOpen(true)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
