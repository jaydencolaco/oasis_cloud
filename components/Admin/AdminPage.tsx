"use client";
import React, { useEffect, useState } from "react";
import Login from "../Login";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Archive,
  Calendar,
  Copy,
  IdCard,
  MapPinned,
  Paintbrush,
  Plus,
  Search,
  Trash,
  Wallet,
} from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Toaster } from "../ui/sonner";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";

export interface Details {
  type: string;
  value: string;
}

export interface Beam {
  beamName: string;
  beamVar: string;
  beamImg: string;
}

export interface Color {
  hexCode: string;
  colorName: string;
}

export interface Item {
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
  timestamp: Timestamp;
}

const AdminPage = () => {
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // Login and store in Session Storage
  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserAuth(user);
      } else {
        setUserAuth(null);
      }
    });
    return () => {
      listen();
    };
  }, []);

  const archiveJob = async (id: string) => {
    setIsLoading(true);
    try {
      const userRef: any = doc(db, "products", id);
      await updateDoc(
        userRef,
        {
          deactivate: true,
        } as any,
        { merge: true }
      );
      toast("Product Posting has been Archived", {
        description: "Thank you",
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    } catch (err: any) {
      console.error("Error fetching document:", err.message);
      toast("Error Archiving Product Posting", {
        description: err.message,
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    }
    setIsLoading(false);
  };

  const unarchiveJob = async (id: string) => {
    setIsLoading(true);
    try {
      const userRef: any = doc(db, "products", id);
      await updateDoc(
        userRef,
        {
          deactivate: false,
        } as any,
        { merge: true }
      );
      toast("Product Posting has been Unarchived", {
        description: "Thank you",
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    } catch (err: any) {
      console.error("Error fetching document:", err.message);
      toast("Error Unarchiving Product Posting", {
        description: err.message,
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    }
    setIsLoading(false);
  };

  const deleteJob = async (id: string) => {
    setIsLoading(true);
    try {
      const userRef: any = doc(db, "products", id);
      await deleteDoc(userRef);
      toast("Product Posting has been Deleted", {
        description: "Thank you",
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    } catch (err: any) {
      console.error("Error fetching document:", err.message);
      toast("Error Deleting Product Posting", {
        description: err.message,
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    }
    setIsLoading(false);
  };

  const [arr, setArr] = useState<Item[]>([]);
  const [archivedProducts, setArchivedProducts] = useState<Item[]>([]);
  const [nonArchivedProducts, setNonArchivedProducts] = useState<Item[]>([]);
  const [searchText, setSearchText] = useState("");

  const searchByName = (e: any) => {
    e.preventDefault();
    const lowerCaseSearchText = searchText.toLowerCase();
    const filteredItems = archivedProducts.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseSearchText)
    );
    console.log(filteredItems);
    setArchivedProducts(filteredItems);
    const filteredItems2 = nonArchivedProducts.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseSearchText)
    );
    console.log(filteredItems2);
    setNonArchivedProducts(filteredItems2);
  };

  useEffect(() => {
    const colRef = collection(db, "products");
    getDocs(colRef)
      .then((snapshot) => {
        let user: Item[] = [];
        snapshot.docs.forEach((doc) => {
          user.push({ ...doc.data(), id: doc.id } as Item);
        });
        user.sort((a: any, b: any) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category); // Sort by category
          }
          if (a.subCategoryL1 !== b.subCategoryL1) {
            return a.subCategoryL1.localeCompare(b.subCategoryL1); // Sort by subCategory
          }
        });
        setArr(user);
        const archivedProduct = user.filter((item) => item.deactivate);
        const NonarchivedProducts = user.filter((item) => !item.deactivate);
        setArchivedProducts(archivedProduct);
        setNonArchivedProducts(NonarchivedProducts);
        console.log(user);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [isLoading]);

  return (
    <div>
      <Toaster />
      {userAuth ? (
        <div>
          <div className="md:w-[80%] w-[90%] py-10 mx-auto">
            <div className="flex justify-between mb-3">
              <h2 className="text-xl font-bold">Add Products</h2>
              <Link href="/admin/add-products">
                <Button>
                  <Plus />
                  Add a New Product
                </Button>
              </Link>
            </div>
            <Separator />
            <form className="w-full flex mt-2 gap-3" onSubmit={searchByName}>
              <Input
                placeholder="Search for a Product"
                value={searchText}
                onChange={(e: any) => {
                  setSearchText(e.target.value);
                }}
                required
              />
              <Button type="submit" variant={"oasis"}>
                <Search />
                Search
              </Button>
            </form>
            <Tabs defaultValue="nonArchivedProducts" className=" my-2 w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nonArchivedProducts">
                  Active Products
                </TabsTrigger>
                <TabsTrigger value="archivedProducts">
                  Archived Products
                </TabsTrigger>
              </TabsList>
              <TabsContent value="nonArchivedProducts">
                <div className="my-3 grid sm:grid-cols-3 gap-3">
                  {nonArchivedProducts.map((item, i) => (
                    <Card key={i}>
                      {item.mainImg ? (
                        <Image
                          priority
                          src={`${item.mainImg}`}
                          className="rounded-t-md bg-[#ebebeb] w-full aspect-video object-cover"
                          height={200}
                          width={200}
                          alt={item.name}
                        />
                      ) : (
                        <Image
                          src="https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742583368/2_y1t5dw.png"
                          className="rounded-t-md bg-[#ebebeb] w-full aspect-video object-cover"
                          height={200}
                          width={200}
                          alt={item.name}
                        />
                      )}
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <div className="flex flex-wrap gap-2 -mt-2 mb-3">
                            <Badge>{item.category}</Badge>
                            <Badge variant={"outline"}>
                              {item.subCategoryL1}
                            </Badge>
                          </div>
                          <div className="grid w-full items-center gap-4">
                            <CardDescription className="flex justify-between">
                              <div className="flex gap-3">
                                <IdCard size={20} /> {item.code}
                              </div>
                              {item.price ? (
                                <div className="flex gap-3">
                                  <Wallet size={20} />₹{item.price}/-
                                </div>
                              ) : (
                                ""
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>
                                Make changes to your product here. Click save
                                when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              Are you sure you want to Edit this Product posting
                            </div>
                            <DialogFooter>
                              <Link
                                href={`/admin/edit-products/${item.id
                                  .toLowerCase()
                                  .replace(/ /g, "_")}`}
                              >
                                <Button type="submit">Edit Product</Button>
                              </Link>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <div className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-red-500"
                              >
                                <Trash />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Delete Product Posting
                                </DialogTitle>
                                <DialogDescription>
                                  Deleting your product posting means any data
                                  regarding this product posting is completely
                                  cleared from the database
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                Are you sure you want to Delete this product
                                posting
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    deleteJob(item.id);
                                  }}
                                >
                                  Delete product
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-yellow-600"
                              >
                                <Archive />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Archive Product Posting
                                </DialogTitle>
                                <DialogDescription>
                                  Archiving your product posting means the data
                                  is saved but is not visible to any live
                                  visitors on the website
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                Are you sure you want to Archive this product
                                posting
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    archiveJob(item.id);
                                  }}
                                >
                                  Archive Product
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-green-500"
                              >
                                <Copy />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Clone Product Posting</DialogTitle>
                                <DialogDescription>
                                  This will clone this product into a new
                                  product posting to add the current product
                                  with similar product information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                Are you sure you want to Clone this product
                                posting
                              </div>
                              <DialogFooter>
                                <Link
                                  href={`/admin/clone-products/${item.id
                                    .toLowerCase()
                                    .replace(/ /g, "_")}`}
                                >
                                  <Button>Clone product</Button>
                                </Link>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="archivedProducts">
                <div className="my-3 grid sm:grid-cols-3 gap-3">
                  {archivedProducts.map((item, i) => (
                    <Card key={i}>
                      {item.mainImg ? (
                        <Image
                          priority
                          src={`${item.mainImg}`}
                          className="rounded-t-md bg-[#ebebeb] w-full aspect-video object-cover"
                          height={200}
                          width={200}
                          alt={item.name}
                        />
                      ) : (
                        <Image
                          src="https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742583368/2_y1t5dw.png"
                          className="rounded-t-md bg-[#ebebeb] w-full aspect-video object-cover"
                          height={200}
                          width={200}
                          alt={item.name}
                        />
                      )}
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div>
                          <div className="flex flex-wrap gap-2 -mt-2 mb-3">
                            <Badge>{item.category}</Badge>
                            <Badge variant={"outline"}>
                              {item.subCategoryL1}
                            </Badge>
                          </div>
                          <div className="grid w-full items-center gap-4">
                            <CardDescription className="flex justify-between">
                              <div className="flex gap-3">
                                <IdCard size={20} /> {item.code}
                              </div>
                              {item.price ? (
                                <div className="flex gap-3">
                                  <Wallet size={20} />₹{item.price}/-
                                </div>
                              ) : (
                                ""
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Edit</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Product</DialogTitle>
                              <DialogDescription>
                                Make changes to your product here. Click save
                                when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              Are you sure you want to Edit this Product posting
                            </div>
                            <DialogFooter>
                              <Link href={`/admin/edit-products/${item.id}`}>
                                <Button type="submit">Edit Product</Button>
                              </Link>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <div className="flex gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-red-500"
                              >
                                <Trash />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Delete Product Posting
                                </DialogTitle>
                                <DialogDescription>
                                  Deleting your product posting means any data
                                  regarding this product posting is completely
                                  cleared from the database
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                Are you sure you want to Delete this product
                                posting
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    deleteJob(item.id);
                                  }}
                                >
                                  Delete product
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-yellow-600"
                              >
                                <Archive />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>
                                  Unarchive Product Posting
                                </DialogTitle>
                                <DialogDescription>
                                  Unarchiving your product posting means the
                                  data is saved and is visible to any live
                                  visitors on the website
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                Are you sure you want to Unarchive this product
                                posting
                              </div>
                              <DialogFooter>
                                <Button
                                  onClick={() => {
                                    unarchiveJob(item.id);
                                  }}
                                >
                                  Unarchive Product
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="text-green-500"
                              >
                                <Copy />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Clone Product Posting</DialogTitle>
                                <DialogDescription>
                                  This will clone this product into a new
                                  product posting to add the current product
                                  with similar product information
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                Are you sure you want to Clone this product
                                posting
                              </div>
                              <DialogFooter>
                                <Link href={`/admin/clone-products/${item.id}`}>
                                  <Button>Clone product</Button>
                                </Link>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default AdminPage;
