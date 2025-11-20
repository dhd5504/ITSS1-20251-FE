import { useParams, useNavigate } from "react-router-dom";
import { mockSpots } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, MapPin, Clock, Phone, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SpotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAuth();
  const spot = mockSpots.find(s => s.id === id);

  if (!spot) {
    return <div>スポットが見つかりません</div>;
  }

  const isFavorite = favorites.includes(spot.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100">
      <div className="relative">
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 z-10 rounded-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4 z-10 rounded-full"
          onClick={() => toggleFavorite(spot.id)}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
        <img 
          src={spot.image} 
          alt={spot.name}
          className="w-full h-64 object-cover"
        />
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card className="p-6 space-y-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{spot.name}</h1>
            <div className="flex items-center gap-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(spot.rating) ? "fill-current" : ""}`} />
              ))}
              <span className="text-sm text-muted-foreground">
                {spot.rating} / 5 ({spot.reviewCount}件)
              </span>
            </div>
          </div>

          <p className="text-muted-foreground">{spot.description}</p>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">住所</p>
                <p className="text-sm text-muted-foreground">{spot.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">電話</p>
                <p className="text-sm text-muted-foreground">{spot.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="font-medium">ビジネス時間</p>
                <p className="text-sm text-muted-foreground">
                  平日: {spot.hours}<br />
                  土日: {spot.hours}
                </p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">料金</p>
              <div className="flex gap-2">
                <Badge>大人 {spot.price}</Badge>
                <Badge>子供 ¥500</Badge>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">施設と設備</p>
            <div className="flex flex-wrap gap-2">
              {spot.features.map((feature) => (
                <Badge key={feature} variant="secondary">{feature}</Badge>
              ))}
            </div>
          </div>

          {spot.reviews.length > 0 && (
            <div>
              <p className="font-medium mb-3">クチコミ</p>
              <div className="space-y-3">
                {spot.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{review.userName}</p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : ""}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{review.rating}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                    <div className="flex gap-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Posted by {review.userName} • {review.date}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
            onClick={() => navigate(`/review/${spot.id}`)}
          >
            このスポットを予約する
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SpotDetail;
