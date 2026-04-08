"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, X, ShoppingCart, User, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  searchTags: string[];
  onSearchTagsChange: (tags: string[]) => void;
  postalCode: string;
  onPostalCodeChange: (code: string) => void;
  radius: number;
  onRadiusChange: (radius: number) => void;
  hasAccount: boolean;
}

export function Header({
  searchTags,
  onSearchTagsChange,
  postalCode,
  onPostalCodeChange,
  radius,
  onRadiusChange,
  hasAccount,
}: HeaderProps) {
  const [searchInput, setSearchInput] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchTags.length < 5) {
      onSearchTagsChange([...searchTags, searchInput.trim()]);
      setSearchInput("");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4 mb-3">
          <Link href="/" className="text-xl font-bold text-green-600">
            Épiceries Faciles
          </Link>
          <div className="flex-1" />
          <Link href="/list-planner">
            <Button variant="outline" size="sm" className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ma liste
            </Button>
          </Link>
          <Link href="/account">
            <Button variant={hasAccount ? "default" : "outline"} size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {hasAccount ? "Mon compte" : "Créer un compte"}
            </Button>
          </Link>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={
                  searchTags.length >= 5
                    ? "Maximum 5 termes de recherche (version gratuite)"
                    : "Rechercher (ex : lait, pommes)…"
                }
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
                disabled={searchTags.length >= 5}
              />
            </form>
            {searchTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {searchTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => onSearchTagsChange(searchTags.filter((t) => t !== tag))}
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Code postal"
                value={postalCode}
                onChange={(e) => onPostalCodeChange(e.target.value)}
                className="w-36 pl-10"
              />
            </div>
            <select
              value={radius}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={15}>15 km</option>
              <option value={20}>20 km</option>
              <option value={30}>30 km</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}
