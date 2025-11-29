import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Heart, MapPin, Clock, Phone, Star } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { Spot } from "@/data/mockData";
import { formatHours, formatPrice } from "@/lib/constants";

const SpotDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAuth();
  const [spot, setSpot] = useState<Spot | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`api/spots/${id}`);

        if (response.status === 200) {
          console.log(response.data.data);
          setSpot(response.data.data);
        }
      } catch (error) {
        toast.error("スポットの取得に失敗しました");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSpot();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-blue-100 flex items-center justify-center">
        <p>スポットが見つかりません</p>
      </div>
    );
  }

  const isFavorite = favorites.includes(spot.id);

  // Helper to get higher resolution image for Unsplash or handle local path
  const getOptimizedImageUrl = (url: string) => {
    if (url.includes("images.unsplash.com")) {
      return url.replace("w=800", "w=1920").replace("w=400", "w=1920");
    }
    return url.startsWith("http") ? url : `/${url}`;
  };

  return (
    <div className="min-h-screen relative">
      {/* Full screen background image */}
      <div className="fixed inset-0 z-0">
        <img
          src={getOptimizedImageUrl(spot.image)}
          alt={spot.name}
          className="w-full h-full object-cover transition-opacity duration-500"
          style={{ filter: "contrast(1.05) saturate(1.05)" }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed top-4 left-4 z-20 rounded-full bg-white/80 hover:bg-white"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="fixed top-4 right-4 z-20 rounded-full bg-white/80 hover:bg-white"
        onClick={() => toggleFavorite(spot.id)}
      >
        <Heart
          className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
        />
      </Button>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center justify-center py-8">
        <Card className="w-full max-w-2xl p-6 space-y-4 bg-white/95 backdrop-blur-sm shadow-xl">
          <div>
            <h1 className="text-2xl font-bold mb-2">{spot.name}</h1>
            <div className="flex items-center gap-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(spot.rating) ? "fill-current" : ""
                  }`}
                />
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

            {spot.hours === "24時間営業" ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  24時間営業
                </span>
              </div>
            ) : formatHours(spot.hours).normal ===
              formatHours(spot.hours).weekend ? (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground">
                  {formatHours(spot.hours).normal}
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">平日:</p>
                    <p className="text-sm text-muted-foreground">
                      {formatHours(spot.hours).normal}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="font-medium">週末:</p>
                    <p className="text-sm text-muted-foreground">
                      {formatHours(spot.hours).weekend}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <p className="font-medium mb-2">料金</p>
              <div className="flex gap-2">
                <Badge>{formatPrice(spot.price)}</Badge>
              </div>
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">施設と設備</p>
            <div className="flex flex-wrap gap-2">
              {(() => {
                try {
                  const featuresObj = JSON.parse(spot.features);
                  const featureLabels: Record<string, string> = {
                    small: "1-2人",
                    medium: "3-5人",
                    big: "6人以上",
                    children: "子供向け",
                    adult: "大人向け",
                    all: "全年齢",
                  };

                  return Object.values(featuresObj).map((val: any) => (
                    <Badge key={val} variant="secondary">
                      {featureLabels[val] || val}
                    </Badge>
                  ));
                } catch (e) {
                  return null;
                }
              })()}
            </div>
          </div>

          {spot.reviews?.length > 0 && (
            <div>
              <p className="font-medium mb-3">クチコミ</p>
              <div className="space-y-3">
                {spot.reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{review.userName}</p>
                      <div className="flex items-center gap-1 text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating ? "fill-current" : ""
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {review.rating}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {review.comment}
                    </p>
                    <div className="flex gap-2">
                      {review.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Posted by {review.userName} • {review.date}
                    </p>
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
