import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Beam, Color, Details } from "../Admin/AdminPage";
import { Badge } from "../ui/badge";

export interface Item2 {
  id: string;
  name: string;
  code: string;
  mainImg: string;
  subImg: string[];
  category: string;
  subCategoryL1: string;
  subCategoryL2: string;
  wattage: string;
  description: string;
  details: Details[];
  features: string;
  dimensions: string;
  colorConfig: Color[];
  beamConfig: Beam[];
  dimensionInfo: string;
  price: string;
  deactivate: boolean;
}

const ProdBox = ({ item }: { item: Item2 }) => {
  return (
    <div className="relative group">
      <Link
        rel="preload"
        href={`/products/${item.category.toLowerCase()}/${item.subCategoryL1
          .toLowerCase()
          .replace(/ /g, "_")}/${item.id.toLowerCase().replace(/ /g, "_")}`}
      >
        <div className="overflow-hidden">
          {item.mainImg ? (
            <Image
              priority
              rel="preconnect"
              src={item.mainImg}
              className="rounded-md bg-[#ebebeb] w-full aspect-square object-cover transform transition-transform duration-[6000ms] ease-in-out hover:scale-110"
              height={200}
              width={200}
              alt={`${item.name}_mainImg`}
            />
          ) : (
            <Image
              src="https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742583368/2_y1t5dw.png"
              className="rounded-md bg-[#ebebeb] w-full aspect-square object-cover transform transition-transform duration-[6000ms] ease-in-out hover:scale-110"
              height={200}
              width={200}
              alt={item.name}
            />
          )}
        </div>
        <div className="group-hover:opacity-100 absolute opacity-0 transition-opacity duration-500 right-5 bottom-16">
          <div className="bg-white rounded-full p-3">
            <ChevronRight />
          </div>
        </div>
        {/* <div className="uppercase absolute left-2 top-1.5">
          <Badge>{item.category}</Badge>
        </div>
        <div className="uppercase absolute right-2 top-1.5">
          <Badge>{item.subCategoryL1}</Badge>
        </div> */}
        <h2 className="text-black flex uppercase justify-center mt-4 tracking-widest font-light w-full">
          {item.name}
        </h2>
      </Link>
    </div>
  );
};

export default ProdBox;
