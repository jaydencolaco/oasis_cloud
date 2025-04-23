"use client";
import React, { Suspense, useEffect, useState } from "react";
import Helmet from "../Helmet";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  startAt,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TriangleAlert } from "lucide-react";
import ProductsRepeater, { FilterOptions, Item } from "./ProductsRepeater";
import ProdBox from "./ProdBox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "../ui/skeleton";

export const SkeletonCard = () => (
  <div className="flex flex-col space-y-3">
    <Skeleton className="h-96 aspect-square" />
    <div className="space-y-2">
      <Skeleton className="h-4 bg-gray-200 rounded w-full animate-pulse" />
      <Skeleton className="h-4 bg-gray-200 rounded w-full animate-pulse" />
    </div>
  </div>
);

const ProductsGrid = () => {
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Item[]>([]);
  const [helmetText, setHelmetText] = useState<string[] | null>(null);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);

  const rowsPerPage = 21;
  const [startIndex, setStartIndex] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(rowsPerPage + 1);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchPaginatedProducts = async (
    lastDoc: QueryDocumentSnapshot<DocumentData> | null = null
  ) => {
    const colRef = collection(db, "products");

    const q = lastDoc
      ? query(
          colRef,
          where("deactivate", "==", false),
          orderBy("category"),
          orderBy("subCategoryL1"),
          startAfter(lastDoc),
          limit(rowsPerPage)
        )
      : query(
          colRef,
          where("deactivate", "==", false),
          orderBy("category"),
          orderBy("subCategoryL1"),
          limit(rowsPerPage)
        );

    const snapshot = await getDocs(q);

    const fetchedData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Item[];

    setAllProducts((prev) =>
      lastDoc ? [...prev, ...fetchedData] : fetchedData
    );

    return {
      products: fetchedData,
      lastVisible: snapshot.docs[snapshot.docs.length - 1] || null,
    };
  };

  useEffect(() => {
    const getTotalCount = async () => {
      const coll = collection(db, "products");
      const activeQuery = query(coll, where("deactivate", "==", false));
      const snapshot = await getCountFromServer(activeQuery);
      setTotalCount(snapshot.data().count);
    };
    getTotalCount();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const { products, lastVisible } = await fetchPaginatedProducts();
      setDisplayedProducts(products);
      setLastVisible(lastVisible);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!lastVisible) return;

    try {
      const { products: newProducts, lastVisible: newLastVisible } =
        await fetchPaginatedProducts(lastVisible);

      setDisplayedProducts((prev) => [...prev, ...newProducts]);
      setLastVisible(newLastVisible);
    } catch (err) {
      console.error("Error loading more products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSearch = (searchText: string) => {
    const filtered = allProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !item.deactivate
    );
    setDisplayedProducts(filtered);
    setStartIndex(0);
  };

  const handleFilter = (filters: FilterOptions) => {
    let result = allProducts.filter((item) => {
      if (item.deactivate) return false;
      if (filters.mainCategory && item.category !== filters.mainCategory)
        return false;
      if (
        filters.mainCategory &&
        filters.subCategory &&
        item.subCategoryL1 !== filters.subCategory
      )
        return false;

      const watt = Number(item.wattage);
      return filters.maxLimit
        ? watt >= filters.wattMin
        : watt >= filters.wattMin && watt <= filters.wattMax;
    });

    setDisplayedProducts(result);
    setStartIndex(0);

    if (filters.mainCategory && filters.subCategory) {
      setHelmetText([filters.mainCategory, filters.subCategory]);
    } else if (filters.mainCategory) {
      setHelmetText([filters.mainCategory]);
    } else {
      setHelmetText(null);
    }
  };

  const handleRefresh = () => {
    const refreshed = allProducts.filter((product) => !product.deactivate);
    setDisplayedProducts(refreshed);
    setStartIndex(0);
  };

  const currentPageProducts = displayedProducts.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  return (
    <div>
      <Helmet text={helmetText} />
      <div className="sm:w-[82%] mx-auto w-[90%]">
        <ProductsRepeater
          onSearch={handleSearch}
          onFilter={handleFilter}
          onRefresh={handleRefresh}
          defaultCategory=""
        />

        {loading ? (
          <div className="my-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: rowsPerPage }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : currentPageProducts.length === 0 ? (
          <div className="flex justify-center items-center text-black min-h-[400px] w-full">
            <div className="flex gap-3">
              <TriangleAlert className="text-yellow-600" />
              No Products in this Category
            </div>
          </div>
        ) : (
          <>
            <div className="my-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {currentPageProducts.map((item) => (
                <Suspense fallback={<SkeletonCard />} key={item.id}>
                  <ProdBox item={item} />
                </Suspense>
              ))}
            </div>

            <div className="py-10">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={
                        startIndex === 0 ? "pointer-events-none opacity-50" : ""
                      }
                      onClick={() => {
                        setStartIndex((prev) =>
                          Math.max(0, prev - rowsPerPage)
                        );
                        scrollToTop();
                      }}
                    />
                  </PaginationItem>

                  <PaginationItem>
                    <PaginationNext
                      className={
                        startIndex + rowsPerPage >= displayedProducts.length &&
                        allProducts.length >= totalCount
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                      onClick={async () => {
                        const nextIndex = startIndex + rowsPerPage;

                        if (
                          nextIndex >= allProducts.length &&
                          allProducts.length < totalCount
                        ) {
                          await loadMore();
                        }

                        setStartIndex(nextIndex);
                        scrollToTop();
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsGrid;
