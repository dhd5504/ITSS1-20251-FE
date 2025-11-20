import { Header } from "@/components/Header";
import { SpotCard } from "@/components/SpotCard";
import { Button } from "@/components/ui/button";
import { mockSpots } from "@/data/mockData";
import { Building, Coffee, UtensilsCrossed, Trees, Warehouse, Building2 } from "lucide-react";

const categories = [
  { icon: Trees, label: "公園", value: "公園" },
  { icon: Coffee, label: "カフェ", value: "カフェ" },
  { icon: UtensilsCrossed, label: "レストラン", value: "レストラン" },
  { icon: Warehouse, label: "動物園", value: "動物園" },
  { icon: Building, label: "屋内場", value: "屋内場" },
  { icon: Building2, label: "博物館", value: "博物館" },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">カテゴリーで絞り込み</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </Button>
            ))}
          </div>
        </section>

        <section>
          <div className="bg-muted/30 p-4 rounded-lg mb-4">
            <h2 className="text-xl font-bold mb-1">おすすめスポット</h2>
            <p className="text-sm text-muted-foreground">6件のスポットが見つかりました</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockSpots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
