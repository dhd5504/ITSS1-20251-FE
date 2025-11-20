import { useState } from "react";
import { Header } from "@/components/Header";
import { SpotCard } from "@/components/SpotCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { mockSpots } from "@/data/mockData";
import { Filter } from "lucide-react";

const Search = () => {
  const [distance, setDistance] = useState([10]);
  const [selectedWeather, setSelectedWeather] = useState<string[]>(["晴れ"]);
  const [selectedPeople, setSelectedPeople] = useState<string[]>(["2-3人"]);
  const [selectedAge, setSelectedAge] = useState<string[]>(["0-3歳"]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>(["無料"]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold">おすすめスポット</h2>
            <p className="text-sm text-muted-foreground">4件のスポットが見つかりました</p>
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                フィルター
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle>フィルター</SheetTitle>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                <div>
                  <Label>距離 (km)</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <span>1 km</span>
                    <Slider 
                      value={distance}
                      onValueChange={setDistance}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span>10 km</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">天気</Label>
                  <div className="space-y-2">
                    {["晴れ", "曇り", "雨"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedWeather.includes(item)}
                          onCheckedChange={(checked) => {
                            setSelectedWeather(prev =>
                              checked ? [...prev, item] : prev.filter(i => i !== item)
                            );
                          }}
                        />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">人数</Label>
                  <div className="space-y-2">
                    {["1-2人", "2-3人", "6人以上"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedPeople.includes(item)}
                          onCheckedChange={(checked) => {
                            setSelectedPeople(prev =>
                              checked ? [...prev, item] : prev.filter(i => i !== item)
                            );
                          }}
                        />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">年齢層</Label>
                  <div className="space-y-2">
                    {["0-3歳", "3-5歳", "6-12歳", "13歳以上"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedAge.includes(item)}
                          onCheckedChange={(checked) => {
                            setSelectedAge(prev =>
                              checked ? [...prev, item] : prev.filter(i => i !== item)
                            );
                          }}
                        />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-2 block">料金</Label>
                  <div className="space-y-2">
                    {["無料", "¥1 - ¥1,000"].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Checkbox 
                          checked={selectedPrice.includes(item)}
                          onCheckedChange={(checked) => {
                            setSelectedPrice(prev =>
                              checked ? [...prev, item] : prev.filter(i => i !== item)
                            );
                          }}
                        />
                        <label className="text-sm">{item}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockSpots.slice(0, 4).map((spot) => (
            <SpotCard key={spot.id} spot={spot} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Search;
