import { MapPin, Filter, Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <Input
              placeholder="場所やカテゴリーを検索..."
              className="pl-10"
              onClick={() => navigate("/search")}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          </div>
          <Button variant="outline" onClick={() => navigate("/search")}>
            <MapPin className="w-4 h-4" />
            <h3>位置情報</h3>
          </Button>
          <Button variant="outline" onClick={() => navigate("/search")}>
            <Filter className="w-4 h-4" />
            <h3>フィルター</h3>
          </Button>
          <Button variant="outline" onClick={() => navigate("/favorites")}>
            <Heart className="w-4 h-4" />
            <h3>お気に入り</h3>
          </Button>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div className="flex flex-col">
                <button
                  onClick={() => navigate("/profile")}
                  className="text-sm hover:underline"
                >
                  プロフィール
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm hover:underline"
                >
                  ログアウト
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
