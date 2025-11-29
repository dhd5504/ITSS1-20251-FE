import { Heart, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Spot } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatHours, formatPrice } from "@/lib/constants";

interface SpotCardProps {
  spot: Spot;
}

export const SpotCard = ({ spot }: SpotCardProps) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAuth();
  const isFavorite = favorites.includes(spot.id);

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/spot/${spot.id}`)}
    >
      <div className="relative h-48">
        <img
          src={spot.image.startsWith("http") ? spot.image : `/${spot.image}`}
          alt={spot.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-primary">
          {formatPrice(spot.price)}
        </Badge>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-2 right-2 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(spot.id);
          }}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
        </Button>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{spot.name}</h3>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{spot.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>現在地から {parseFloat(spot.distance).toFixed(1)}km</span>
          </div>
          {spot.hours === "24時間営業" ? (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>24時間営業</span>
            </div>
          ) : formatHours(spot.hours).normal ===
            formatHours(spot.hours).weekend ? (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatHours(spot.hours).normal}</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>
                  平日: {formatHours(spot.hours).normal} 週末:{" "}
                  {formatHours(spot.hours).weekend}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
