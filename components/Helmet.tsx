import { ChevronRight, Home } from "lucide-react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "next/image";

interface HelmetProps {
  text: string[] | null;
}

const Helmet: React.FC<HelmetProps> = ({ text }) => {
  return (
    <div>
      <div className="text-sm sm:text-sm py-5 mt-3 text-black">
        <div className="sm:w-[82%] mx-auto uppercase tracking-widest font-extralight w-[90%]">
          <h3 className="flex gap-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Image
                      src="/vector.svg"
                      height={20}
                      width={20}
                      alt="Home"
                    />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink rel="preload" href="/products">
                    Products
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {text &&
                  text.map((val, i) => {
                    const path = text
                      .slice(0, i + 1)
                      .map((v) => v.toLowerCase().replace(/ /g, "_"))
                      .join("/");
                    return (
                      <div className="flex gap-3" key={i}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink
                            rel="preload"
                            href={`/products/${path}`}
                          >
                            {val}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </div>
                    );
                  })}
              </BreadcrumbList>
            </Breadcrumb>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Helmet;
