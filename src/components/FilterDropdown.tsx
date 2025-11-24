import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { useState } from "react";

interface FilterDropdownProps {
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
}

export const FilterDropdown = ({
  onFilterChange,
  currentFilters,
}: FilterDropdownProps) => {
  const [distance, setDistance] = useState([currentFilters?.maxDistance || 10]);
  const [group, setGroup] = useState(currentFilters?.group || "");
  const [suitable, setSuitable] = useState(currentFilters?.suitable || "");
  const [price, setPrice] = useState(currentFilters?.price || "");

  // Apply filters when user clicks Apply button
  const handleApplyFilters = () => {
    if (onFilterChange) {
      onFilterChange({
        maxDistance: distance[0],
        group: group || undefined,
        suitable: suitable || undefined,
        price: price || undefined,
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setDistance([10]);
    setGroup("");
    setSuitable("");
    setPrice("");

    if (onFilterChange) {
      onFilterChange({
        maxDistance: undefined,
        group: undefined,
        suitable: undefined,
        price: undefined,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          <h3>フィルター</h3>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Distance Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <DropdownMenuLabel className="p-0 text-base font-medium">
                距離 (km)
              </DropdownMenuLabel>
            </div>
            <div className="pt-2">
              <Slider
                defaultValue={[10]}
                max={20}
                step={1}
                value={distance}
                onValueChange={setDistance}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 km</span>
                <span>{distance} km</span>
                <span>20 km</span>
              </div>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* group Section */}
          <div className="space-y-3">
            <DropdownMenuLabel className="p-0 text-base font-medium">
              人数
            </DropdownMenuLabel>
            <RadioGroup value={group} onValueChange={setGroup}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="small-group" />
                <Label htmlFor="small-group" className="cursor-pointer">
                  1-2人
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium-group" />
                <Label htmlFor="medium-group" className="cursor-pointer">
                  3-5人
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="big" id="big-group" />
                <Label htmlFor="big-group" className="cursor-pointer">
                  6人以上
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DropdownMenuSeparator />

          {/* suitable Section */}
          <div className="space-y-3">
            <DropdownMenuLabel className="p-0 text-base font-medium">
              年齢層
            </DropdownMenuLabel>
            <RadioGroup value={suitable} onValueChange={setSuitable}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="suitable-all" />
                <Label htmlFor="suitable-all" className="cursor-pointer">
                  全部
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="children" id="suitable-children" />
                <Label htmlFor="suitable-children" className="cursor-pointer">
                  子供
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="adult" id="suitable-adult" />
                <Label htmlFor="suitable-adult" className="cursor-pointer">
                  大人
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DropdownMenuSeparator />

          {/* Price Section */}
          <div className="space-y-3">
            <DropdownMenuLabel className="p-0 text-base font-medium">
              料金
            </DropdownMenuLabel>
            <RadioGroup value={price} onValueChange={setPrice}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="price-free" />
                <Label
                  htmlFor="price-free"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  無料
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="<=150000" id="price-paid" />
                <Label htmlFor="price-paid" className="cursor-pointer">
                  ≤150.000đ
                </Label>
              </div>
            </RadioGroup>
          </div>

          <DropdownMenuSeparator />

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleApplyFilters} className="flex-1" size="sm">
              適用
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              クリア
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
