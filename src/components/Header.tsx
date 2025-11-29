import { MapPin, Filter, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { useLogout } from "@/hooks/useLogout";
import { FilterDropdown } from "@/components/FilterDropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onToggleFavorites?: () => void;
  showFavorites?: boolean;
  onFilterChange?: (filters: {
    maxDistance?: number;
    group?: string;
    suitable?: string;
    price?: string;
  }) => void;
  currentFilters?: {
    maxDistance?: number;
    group?: string;
    suitable?: string;
    price?: string;
  };
  onSearchChange?: (value: string) => void;
  searchValue?: string;
}

export const Header = ({
  onToggleFavorites,
  showFavorites = false,
  onFilterChange,
  currentFilters,
  onSearchChange,
  searchValue = "",
}: HeaderProps) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { updateLocation, isLoading } = useLocation();
  const { logout } = useLogout();

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Input
              placeholder="場所やカテゴリーを検索..."
              className="pl-10"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Button
            variant="outline"
            onClick={updateLocation}
            disabled={isLoading}
          >
            <MapPin className="w-4 h-4" />
            <h3>{isLoading ? "取得中..." : "位置情報"}</h3>
          </Button>
          <FilterDropdown
            onFilterChange={onFilterChange}
            currentFilters={currentFilters}
          />
          <Button
            variant={showFavorites ? "default" : "outline"}
            onClick={() =>
              onToggleFavorites ? onToggleFavorites() : navigate("/favorites")
            }
          >
            <Heart
              className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`}
            />
            <h3>お気に入り</h3>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                プロフィール
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                ログアウト
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
