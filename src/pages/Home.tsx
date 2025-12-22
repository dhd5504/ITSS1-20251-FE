import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { SpotCard } from "@/components/SpotCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Building,
  Coffee,
  UtensilsCrossed,
  Trees,
  Warehouse,
  Building2,
} from "lucide-react";
import apiClient from "@/lib/axios";
import { toast } from "sonner";
import { useLocation } from "@/contexts/LocationContext";

const categories = [
  { icon: Trees, label: "公園", value: "PARK" },
  { icon: Coffee, label: "カフェ", value: "CAFE" },
  { icon: UtensilsCrossed, label: "レストラン", value: "RESTAURANT" },
  { icon: Warehouse, label: "動物園", value: "ZOO" },
  { icon: Building, label: "屋内場", value: "INDOOR_VENUE" },
  { icon: Building2, label: "博物館", value: "MUSEUM" },
];

const Home = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [spots, setSpots] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { favorites } = useAuth();
  const { latitude, longitude } = useLocation();
  const [params, setParams] = useState({
    q: "",
    category: "",
    maxDistance: undefined as number | undefined,
    group: undefined as string | undefined,
    suitable: undefined as string | undefined,
    price: undefined as string | undefined,
  });

  // Filter spots based on favorites view
  // No local filtering needed anymore as we fetch from API
  const displaySpots = spots;

  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const handleSearchChange = (value: string) => {
    setParams((prev) => ({
      ...prev,
      q: value,
    }));
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: {
    maxDistance?: number;
    group?: string;
    suitable?: string;
    price?: string;
  }) => {
    setParams((prev) => ({
      ...prev,
      ...filters,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const fetchSpots = async () => {
    try {
      if (showFavorites) {
        const response = await apiClient.get("api/spots/favorites");
        if (response.status === 200) {
          setSpots(response.data.data);
          setTotalPages(1); // Usually favorites are not paginated or handled differently
        }
        return;
      }

      // Build query string from params
      const queryParams = new URLSearchParams();
      if (params.q) queryParams.append("q", params.q);
      if (latitude) queryParams.append("lat", latitude.toString());
      if (longitude) queryParams.append("lng", longitude.toString());
      if (params.category) queryParams.append("category", params.category);
      if (params.maxDistance !== undefined)
        queryParams.append("maxDistance", params.maxDistance.toString());
      if (params.group) queryParams.append("group", params.group);
      if (params.suitable) queryParams.append("suitable", params.suitable);
      if (params.price) queryParams.append("price", params.price);

      // Add pagination params
      queryParams.append("page", currentPage.toString());
      queryParams.append("limit", "6");
      queryParams.append("sortBy", "distance");

      const response = await apiClient.get(
        `api/spots/search?${queryParams.toString()}`
      );

      if (response.status === 200) {
        setSpots(response.data.data);
        if (
          response.data.meta &&
          typeof response.data.meta.total === "number"
        ) {
          const total = response.data.meta.total;
          setTotalPages(Math.ceil(total / 6));
        }
      }
    } catch (error) {
      toast.error("スポットの取得に失敗しました");
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchSpots();
    };
    fetchData();
  }, [latitude, longitude, params, currentPage, showFavorites]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onToggleFavorites={handleToggleFavorites}
        showFavorites={showFavorites}
        onFilterChange={handleFilterChange}
        currentFilters={{
          maxDistance: params.maxDistance,
          group: params.group,
          suitable: params.suitable,
          price: params.price,
        }}
        onSearchChange={handleSearchChange}
        searchValue={params.q}
      />

      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">カテゴリーで絞り込み</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const isSelected = params.category === cat.value;
              return (
                <Button
                  key={cat.value}
                  variant={isSelected ? "default" : "outline"}
                  className="flex items-center gap-2 whitespace-nowrap"
                  onClick={() => {
                    // Toggle: if already selected, clear it; otherwise set new category
                    setParams((prev) => ({
                      ...prev,
                      category: isSelected ? "" : cat.value,
                    }));
                  }}
                >
                  <cat.icon className="w-4 h-4" />
                  {cat.label}
                </Button>
              );
            })}
          </div>
        </section>

        <section>
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-1">
              {showFavorites ? "お気に入りスポット" : "おすすめスポット"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {showFavorites
                ? `${displaySpots.length}件のお気に入りスポット`
                : `${displaySpots.length}件のスポットが見つかりました`}
            </p>
          </div>

          {showFavorites && displaySpots.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                お気に入りのスポットがありません
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displaySpots.map((spot) => (
                <SpotCard key={spot.id} spot={spot} />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {!showFavorites && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              前へ
            </Button>
            <span className="text-sm">
              ページ {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              次へ
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
