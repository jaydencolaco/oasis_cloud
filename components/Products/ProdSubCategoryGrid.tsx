"use client";
import React, { Suspense, useEffect, useState } from "react";
import Helmet from "../Helmet";
import {
  collection,
  DocumentData,
  getCountFromServer,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TriangleAlert } from "lucide-react";
import { SubCatPageProps } from "@/app/products/[category]/[subcategory]/page";
import ProductsRepeater, { FilterOptions, Item } from "./ProductsRepeater";
import ProdBox from "./ProdBox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { SkeletonCard } from "./ProductsGrid";

const ProductsSubCategoryGrid = ({ params }: SubCatPageProps) => {
  const [allProducts, setAllProducts] = useState<Item[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Item[]>([]);
  const [helmetText, setHelmetText] = useState<string[] | null>(null);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const idCat = capitalizeFirstLetter(params!.category);
  const idSubCate = params!.subcategory
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const idSubCat = idSubCate
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("-");

  function capitalizeFirstLetter(str: string): string {
    if (!str) return "";
    return str[0].toUpperCase() + str.slice(1);
  }

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
          where("category", "==", idCat),
          where("subCategoryL1", "==", idSubCat),
          startAfter(lastDoc),
          limit(rowsPerPage)
        )
      : query(
          colRef,
          where("deactivate", "==", false),
          where("category", "==", idCat),
          where("subCategoryL1", "==", idSubCat),
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
      const activeQuery = query(
        coll,
        where("deactivate", "==", false),
        where("category", "==", idCat),
        where("subCategoryL1", "==", idSubCat)
      );
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
      setHelmetText([idCat, idSubCat]);
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

  // useEffect(() => {
  //   const idCat = capitalizeFirstLetter(params!.category);
  //   const idSubCate = params!.subcategory
  //     .split("_")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join(" ");
  //   const idSubCat = idSubCate
  //     .split("-")
  //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  //     .join("-");
  //   const colRef = collection(db, "products");
  //   getDocs(colRef)
  //     .then((snapshot) => {
  //       let main: any = [];
  //       let cat: any = [];
  //       snapshot.docs.forEach((doc) => {
  //         main.push({ ...doc.data(), id: doc.id });
  //       });
  //       let user = main.filter((item: { deactivate: any }) => {
  //         if (item.deactivate) return false;
  //         else return true;
  //       });
  //       user.sort((a: any, b: any) => {
  //         if (a.category !== b.category) {
  //           return a.category.localeCompare(b.category); // Sort by category
  //         }
  //         if (a.subCategoryL1 !== b.subCategoryL1) {
  //           return a.subCategoryL1.localeCompare(b.subCategoryL1); // Sort by subCategory
  //         }
  //       });
  //       setAllProducts(user);
  //       console.log(user);
  //       for (let i = 0; i < user.length; i++) {
  //         if (user[i].subCategoryL1 == idSubCat) {
  //           cat.push(user[i]);
  //         }
  //       }
  //       setDisplayedProducts(cat);
  //       console.log(idCat);
  //       console.log(cat);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  //   setHelmetText([idCat, idSubCat]);
  // }, []);

  const handleSearch = (searchText: string) => {
    if (!allProducts) return;

    const filtered = allProducts.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) &&
        !item.deactivate &&
        (params.category
          ? item.category === capitalizeFirstLetter(params.category)
          : true)
    );
    setDisplayedProducts(filtered);
  };

  const handleFilter = (filters: FilterOptions) => {
    if (!allProducts) return;

    let filter1 = allProducts.filter((item) => {
      if (item.deactivate) return false;

      if (filters.mainCategory && filters.subCategory) {
        if (
          item.category !== filters.mainCategory ||
          item.subCategoryL1 !== filters.subCategory
        ) {
          return false;
        }
      } else if (filters.mainCategory) {
        if (item.category !== filters.mainCategory) {
          return false;
        }
      } else if (params.category) {
        if (item.category !== capitalizeFirstLetter(params.category)) {
          return false;
        }
      }
      return true;
    });

    let filtered = filter1.filter((item) => {
      const wattage = Number(item.wattage);
      if (filters.maxLimit) {
        return wattage >= filters.wattMin;
      } else {
        return wattage >= filters.wattMin && wattage <= filters.wattMax;
      }
    });

    setDisplayedProducts(filtered);

    // Update helmet text based on filters
    if (filters.mainCategory && filters.subCategory) {
      setHelmetText([filters.mainCategory, filters.subCategory]);
    } else if (filters.mainCategory) {
      setHelmetText([filters.mainCategory]);
    } else if (params.category) {
      setHelmetText([
        capitalizeFirstLetter(params.category),
        capitalizeFirstLetter(params.subcategory),
      ]);
    } else {
      setHelmetText([
        `Wattage ${filters.wattMin}-${
          filters.maxLimit ? "100+" : filters.wattMax
        }`,
      ]);
    }
  };

  const handleRefresh = () => {
    if (!allProducts) return;

    const categoryProducts = allProducts.filter(
      (product) =>
        !product.deactivate &&
        (params.category
          ? product.category === capitalizeFirstLetter(params.category)
          : true)
    );
    setDisplayedProducts(categoryProducts);
    setHelmetText(
      params.category ? [capitalizeFirstLetter(params.category)] : null
    );
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
          defaultCategory={
            params
              ? `${capitalizeFirstLetter(
                  params.category
                )}^${capitalizeFirstLetter(params.subcategory)}`
              : ""
          }
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

export default ProductsSubCategoryGrid;
