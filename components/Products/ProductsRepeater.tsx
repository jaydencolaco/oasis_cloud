"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import MultiRangeSlider from "multi-range-slider-react";
import { Filter, RotateCw, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Checkbox } from "../ui/checkbox";

export interface Item {
  id: string;
  name: string;
  code: string;
  mainImg: string;
  subImg: [];
  category: string;
  subCategoryL1: string;
  subCategoryL2: string;
  wattage: string;
  description: string;
  details: [];
  features: string;
  dimensions: string;
  colorConfig: [];
  beamConfig: [];
  dimensionInfo: string;
  price: string;
  deactivate: boolean;
}

interface ProductsRepeaterProps {
  onSearch: (searchText: string) => void;
  onFilter: (filters: FilterOptions) => void;
  onRefresh: () => void;
  defaultCategory?: string;
}

export interface FilterOptions {
  mainCategory: string;
  subCategory: string;
  wattMin: number;
  wattMax: number;
  maxLimit: boolean;
}

const ProductsRepeater: React.FC<ProductsRepeaterProps> = ({
  onSearch,
  onFilter,
  onRefresh,
  defaultCategory,
}) => {
  const testmCat = defaultCategory?.split("^");
  const router = useRouter();
  const [searchText, setSearchText] = React.useState("");
  const [mCategory, setMCategory] = React.useState(testmCat ? testmCat[0] : "");
  const [subCategory, setSubCategory] = React.useState(
    testmCat?.[1]
      ? testmCat[1]
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join("-")
      : ""
  );
  const [wattMin, setWattMin] = React.useState<number>(0);
  const [wattMax, setWattMax] = React.useState<number>(100);
  const [maxLimit, setMaxLimit] = React.useState(true);

  const outdoor = [
    "Bollard Light Series",
    "Wall Light Series",
    "Ceiling Light Series",
    "In-Ground Light Series",
    "Underwater Light Series",
    "Linear Flex Light Series",
    "Spike Light Series",
    "Wall Washer Series",
    "Projector Floodlight Series",
    "Multi-Purpose Floodlight Series",
    "Chain Light Series",
    "Window Light Series",
    "Multi-Purpose Pole Series",
    "Column Light Series",
    "Post-Top Light Series",
    "Street Light Series",
  ];

  const indoor = [
    "Suspension Track System",
    "Hybrid Belt And Magnetic Track System",
    "Magnetic Track System",
    "Hanging Light System Or Belt And Track System",
    "Recessed Line Light",
    "Spotlight Series",
    "Spotlight Series Product Collection",
    "Wall Washer Series",
  ];

  const industrial = [
    "Clean Room Lighting",
    "Flame Proof Lighting",
    "Cold Storage Lighting",
    "Warehouse Lighting",
    "Outdoor Lighting",
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchText);
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const filters: FilterOptions = {
      mainCategory: mCategory,
      subCategory: subCategory,
      wattMin,
      wattMax,
      maxLimit,
    };

    // Apply filters first
    onFilter(filters);

    // Handle navigation based on filter conditions
    if (mCategory && subCategory) {
      router.push(
        `/products/${mCategory.toLowerCase()}/${subCategory
          .toLowerCase()
          .replace(/ /g, "_")}`
      );
    } else if (mCategory) {
      router.push(`/products/${mCategory.toLowerCase()}`);
    }
    // If neither category is selected, stay on current page
  };

  const handleInput = (e: { minValue: number; maxValue: number }) => {
    setWattMin(e.minValue);
    setWattMax(e.maxValue);
  };

  const handleRefresh = () => {
    setSearchText("");
    setMCategory(defaultCategory || "");
    setSubCategory("");
    setWattMin(0);
    setWattMax(100);
    setMaxLimit(false);
    onRefresh();
    router.push("/products");
  };

  return (
    <div>
      <div className="flex sm:flex-row mt-4 flex-col gap-3 justify-between">
        <form className="w-full flex gap-3" onSubmit={handleSearch}>
          <Input
            placeholder="Search for a Product"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            required
          />
          <Button type="submit" variant="oasis">
            <Search />
            Search
          </Button>
        </form>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="oasis">
              <Filter /> Filter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filter Products</DialogTitle>
              <DialogDescription>
                Search for a particular category of products. So that you can
                find your desired product easily
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFilter}>
              <div className="grid gap-6 py-2">
                <div className="grid items-center gap-2">
                  <Label htmlFor="name" className="text-start">
                    Product Category
                  </Label>
                  <Select
                    value={mCategory}
                    onValueChange={(value) => {
                      setMCategory(value);
                      setSubCategory("");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Indoor">Indoor</SelectItem>
                        <SelectItem value="Outdoor">Outdoor</SelectItem>
                        <SelectItem value="Industrial">Industrial</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {mCategory && (
                  <div className="space-y-1">
                    <Label>Select a Sub-Category</Label>
                    <Select
                      value={subCategory}
                      onValueChange={(value) => setSubCategory(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Sub Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {(mCategory === "Indoor"
                            ? indoor
                            : mCategory === "Outdoor"
                            ? outdoor
                            : mCategory === "Industrial"
                            ? industrial
                            : []
                          ).map((value, i) => (
                            <SelectItem key={i} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid items-center gap-2 mt-2">
                  <Label htmlFor="name" className="text-start">
                    <div className="flex justify-between">
                      Product Wattage
                      <div>
                        {wattMin}W - {maxLimit ? "Max " : wattMax}W
                      </div>
                    </div>
                  </Label>
                  <MultiRangeSlider
                    min={0}
                    max={100}
                    step={5}
                    minValue={wattMin}
                    maxValue={wattMax}
                    onInput={handleInput}
                    ruler={false}
                    label={false}
                    barLeftColor="white"
                    barInnerColor="black"
                    barRightColor="white"
                    className="w-full"
                    style={{
                      backgroundColor: "white",
                      boxShadow: "none",
                      border: "none",
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={maxLimit}
                      onCheckedChange={() => setMaxLimit((prev) => !prev)}
                    />
                    <Label>Show 100W+ Products</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="oasis" type="submit">
                  <Filter />
                  Filter
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button onClick={handleRefresh} variant="oasis">
          <RotateCw />
          Refresh
        </Button>
      </div>
    </div>
  );
};

export default ProductsRepeater;
