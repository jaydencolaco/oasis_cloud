"use client";
import React, { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import Helmet from "../Helmet";
import axios from "axios";
import LazyLoad from "react-lazyload";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Item } from "../Admin/AdminPage";
import AWS from 'aws-sdk';

const NewProductPage = ({ id }: { id: string }) => {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Product Link Copied to Clipboard", {
      description: `${text}`,
    });
  };

  interface Details {
    type: string;
    value: string;
  }

  const mainId = id
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  AWS.config.update({
    region: 'ap-south-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/sendProductRequest", {
        name,
        email,
        phone,
        message,
        item: item, // Assuming this is the item name
      });
      toast("Product Request Sent to Oasis Luminaires", {
        description: "We will revert back to you soon",
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    } catch (error) {
      console.error("Failed to send request", error);
      toast("Error sending message", {
        description: "Please check your connectivity",
        action: {
          label: "Done",
          onClick: () => console.log(error),
        },
      });
    } finally {
      setIsLoading(false);
    }
    e.target.reset();
  };
  
  

  // const handleSubmit = async (e: any) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     await axios.post("/api/sendProductMail", {
  //       name: name,
  //       email: email,
  //       phone: phone,
  //       message: message,
  //       item: item,
  //     });
  //     toast("Product Request Sent to Oasis Luminaires", {
  //       description: "We will revert back to you soon",
  //       action: {
  //         label: "Done",
  //         onClick: () => console.log("Done"),
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Failed to send request", error);
  //     toast("Error sending message", {
  //       description: "Please check your connectivity",
  //       action: {
  //         label: "Done",
  //         onClick: () => console.log(error),
  //       },
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  //   e.target.reset();
  // };

  const [dimHoverOn, setDimHoverOn] = useState(false);

  const [item, setItem] = useState<Item | undefined>(undefined);
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchDocs = async () => {
      if (!mainId) return;
      try {
        const userRef = doc(db, "products", mainId);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          setItem(data as Item);
          setImages(data.subImg);
        } else {
          console.log("No such document!");
        }
      } catch (err: any) {
        console.error("Error fetching document:", err.message);
      }
    };
    fetchDocs();
  }, [mainId]);
  const [currentImage, setCurrentImage] = useState(0);

  return (
    <div>
      <Toaster />
      <div className="my-5">
        {item ? (
          <Helmet text={[item!.category, item!.subCategoryL1, item!.name]} />
        ) : (
          ""
        )}
      </div>
      <div className="max-w-[100rem] md:w-[85%] mx-auto p-4">
        {/* Desktop Layout */}
        {item ? (
          <div className="md:h-[75%] mb-10 md:grid md:grid-cols-2 md:gap-8 pb-10">
            {/* Image Gallery */}
            <div className="sm:hidden block h-full space-y-4 pb-5">
              <div className="grid grid-cols-3 gap-2">
                {images.slice(0, 3).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImage(idx)}
                    className={`aspect-square bg-[#ebebeb] ${
                      currentImage === idx ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <LazyLoad>
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </LazyLoad>
                  </button>
                ))}
              </div>
              <div className="aspect-square  bg-[#ebebeb] relative">
                <div className="absolute top-1 left-1 text-[#454343]/75 font-semibold">
                  {item!.code}
                </div>
                <img
                  src={images[currentImage]}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="sm:block hidden space-y-4">
              <div className="flex h-full space-x-4">
                <div className="w-1/4 space-y-8">
                  {images.map((val, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`w-full lg:aspect-[0.70] xl:aspect-[4/5] bg-[#ebebeb] p-2 ${
                        currentImage === idx ? "ring-1 ring-gray-400" : ""
                      }`}
                    >
                      {val ? (
                        <img
                          src={val}
                          alt={`${item.name} ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <img
                          src={
                            "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742583368/2_y1t5dw.png"
                          }
                          alt={`${item.name} ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Main Image */}
                <div className="w-3/4 bg-[#ebebeb] p-4 relative">
                  <div className="absolute top-1 left-1 text-[#454343]/75 font-medium">
                    {item!.code}
                  </div>
                  {images[currentImage] ? (
                    <img
                      src={images[currentImage]}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={
                        "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742583368/2_y1t5dw.png"
                      }
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="mt-1 mb-8">
                  <h2 className="text-4xl font-[550] -ml-1 tracking-tight uppercase">
                    {item.name && item!.name}
                  </h2>
                  <div className="uppercase tracking-[0.2em] font-extralight">
                    {item!.subCategoryL1}
                  </div>
                </div>
                {/* <Separator /> */}
                <div className="flex flex-col mt-1 sm:flex-row justify-between">
                  <div>
                    <div className="rounded-md mb-3 text-sm font-medium">
                      Features
                    </div>
                    <div className="text-[#807E7E] max-w-[15rem] flex flex-col gap-1 text-xs">
                      {item.features &&
                        item!.features.split("_").map((sentence, index) => (
                          <div className="flex gap-3" key={index}>
                            <span className="">•</span>
                            {sentence.trim()}
                            {index < item!.features.split(".").length - 1 &&
                              "."}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col gap-5 sm:mt-0 mt-5">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="font-light tracking-wider text-xs"
                          variant={"oasis"}
                        >
                          Request Information
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>
                            Request for Product Information
                          </DialogTitle>
                          <DialogDescription>
                            For Product Name : {item.name}
                          </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit}>
                          <div className="grid gap-4 py-4">
                            <div className="mb-4 space-y-2">
                              <div>
                                <Label htmlFor="name">
                                  Name{" "}
                                  <span className="text-red-500 text-xs">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="text"
                                  value={name}
                                  onChange={(e: any) => {
                                    setName(e.target.value);
                                  }}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">
                                  Email{" "}
                                  <span className="text-red-500 text-xs">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="email"
                                  id="email"
                                  value={email}
                                  onChange={(e: any) =>
                                    setEmail(e.target.value)
                                  }
                                  required
                                  className="peer invalid:[&:not(:placeholder-shown)]:border-red-500"
                                  placeholder="Enter your email"
                                  title="Enter a valid email address"
                                />
                                <p className="hidden peer-[&:not(:placeholder-shown):invalid]:block text-red-500 text-xs mt-1">
                                  Please provide a valid email address.
                                </p>
                              </div>

                              <div>
                                <Label htmlFor="phone">
                                  Phone Number{" "}
                                  <span className="text-red-500 text-xs">
                                    *
                                  </span>
                                </Label>
                                <Input
                                  type="tel"
                                  value={phone}
                                  required
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    const inputValue = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    ); // Remove non-numeric characters
                                    if (inputValue.length <= 10) {
                                      setPhone(inputValue); // Set only if it's within 10 digits
                                    }
                                  }}
                                  id="phone"
                                  name="phone"
                                  placeholder="Enter a 10 digit phone no."
                                  className="peer invalid:[&:not(:placeholder-shown)]:border-red-500"
                                  maxLength={10} // Ensures max input length at the HTML level
                                  pattern="\d{10}" // Ensures only 10-digit numbers on form submission
                                  title="Enter a valid 10-digit phone number"
                                />
                                <p className="hidden peer-[&:not(:placeholder-shown):invalid]:block text-red-500 text-xs mt-1">
                                  Enter a valid 10-digit phone number
                                </p>
                              </div>
                              <div>
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                  id="message"
                                  value={message}
                                  onChange={(e: any) => {
                                    setMessage(e.target.value);
                                  }}
                                  name="message"
                                  rows={3}
                                />
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            {isLoading ? (
                              <Button disabled variant="oasis" type="submit">
                                <Loader2 className="animate-spin" />
                                Requesting Product
                              </Button>
                            ) : (
                              <Button variant="oasis" type="submit">
                                Request Information
                              </Button>
                            )}
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      className="font-light tracking-wider text-xs"
                      onClick={() =>
                        handleCopy(
                          `https://www.oasisluminaires.com/products/${item.category.toLowerCase()}/${item.subCategoryL1
                            .toLowerCase()
                            .replace(/ /g, "_")}/${item.name
                            .toLowerCase()
                            .replace(/ /g, "_")}`
                        )
                      }
                      variant={"oasis"}
                    >
                      Share Product
                    </Button>
                  </div>
                </div>
                <div className="my-6 text-sm">
                  <div className="pb-1 mb-1 text-sm font-medium">
                    Product Details
                  </div>
                  {/* <Separator className="bg-[#454343] mb-1" /> */}
                  <Table className="border-t border-[#454343] border-opacity-50 sm:block hidden text-sm">
                    <TableBody className="">
                      {item!.details &&
                        item!.details.map((val, i) =>
                          i % 2 === 0 ? (
                            <TableRow className="" key={i}>
                              <TableCell className="w-36 text-xs text-left font-light">
                                {val.type}
                              </TableCell>
                              <TableCell className="w-40 text-xs text-right text-[#454343] font-extralight">
                                {val.value}
                              </TableCell>
                              <TableCell className="sm:block hidden w-8">
                                {""}
                              </TableCell>
                              {item!.details[i + 1] ? (
                                <>
                                  <TableCell className="w-36 text-xs text-left font-light">
                                    <div className="flex gap-3">
                                      {item!.details[i + 1].type}
                                      {i == 0 && item.dimensionInfo ? (
                                        <HoverCard>
                                          <HoverCardTrigger asChild>
                                            <img
                                              src="/infohover.svg"
                                              className="my-auto"
                                              height={16}
                                              width={16}
                                              alt="Right"
                                            />
                                          </HoverCardTrigger>
                                          <HoverCardContent className="w-80">
                                            <div className="flex justify-between space-x-4">
                                              <div className="space-y-1">
                                                <h4 className="text-sm font-semibold">
                                                  Dimensions Information
                                                </h4>
                                                <div className="text-sm">
                                                  This product is available in
                                                  the following dimensions:
                                                  {item.dimensionInfo &&
                                                    item!.dimensionInfo
                                                      .split("_")
                                                      .map(
                                                        (sentence, index) => (
                                                          <div
                                                            className="ml-2 flex gap-3"
                                                            key={index}
                                                          >
                                                            <span className="">
                                                              -
                                                            </span>
                                                            {sentence.trim()}
                                                            {index <
                                                              item!.features.split(
                                                                "."
                                                              ).length -
                                                                1 && "."}
                                                          </div>
                                                        )
                                                      )}
                                                  All dimensions are in mm
                                                </div>
                                              </div>
                                            </div>
                                          </HoverCardContent>
                                        </HoverCard>
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="w-36 text-xs text-right text-[#454343] font-extralight">
                                    {item!.details[i + 1].value}
                                  </TableCell>
                                </>
                              ) : (
                                <>
                                  <TableCell className="text-left">-</TableCell>
                                  <TableCell className="text-right text-[#454343] font-extralight">
                                    -
                                  </TableCell>
                                </>
                              )}
                            </TableRow>
                          ) : null
                        )}
                      <TableRow>
                        <TableCell className="text-xs font-light">
                          CCT
                        </TableCell>
                        <TableCell colSpan={4} className="py-2">
                          <div className="bg-gradient-to-r text-[#454343] font-extralight from-[#fffb97] via-white to-[#e1f8ff] px-8 py-0.5 text-xs flex w-full justify-between">
                            <div>3000K</div>
                            <div>/</div>
                            <div>4500K</div>
                            <div>/</div>
                            <div>6500K</div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="border-t border-[#454343] border-opacity-50 sm:hidden block text-xs">
                    <div className="min-w-xl">
                      {item.details &&
                        item!.details.map((val, i) => (
                          <div key={i} className="">
                            <div className="border-b py-2 w-full grid grid-cols-5 gap-3">
                              <div className="col-span-2 text-left">
                                <div className="flex relative gap-3">
                                  {val.type}
                                  {i == 1 && item.dimensionInfo ? (
                                    <img
                                      onClick={() => {
                                        setDimHoverOn(!dimHoverOn);
                                      }}
                                      src="/infohover.svg"
                                      className="my-auto"
                                      height={16}
                                      width={16}
                                      alt="Right"
                                    />
                                  ) : (
                                    ""
                                  )}
                                  {i == 1 &&
                                  item.dimensionInfo &&
                                  dimHoverOn ? (
                                    <Card className="absolute p-3 z-10 w-60 top-5 left-0 flex justify-between space-x-4">
                                      <div className="space-y-1">
                                        <h4 className="text-sm font-semibold">
                                          Dimensions Information
                                        </h4>
                                        <p className="text-sm">
                                          {item.dimensionInfo}
                                        </p>
                                      </div>
                                    </Card>
                                  ) : (
                                    ""
                                  )}
                                </div>
                              </div>
                              <div className="col-span-3 text-left text-[#454343] font-extralight">
                                {val.value}
                              </div>
                            </div>
                          </div>
                        ))}
                      <div className="border-b py-2 w-full grid grid-cols-5 gap-3">
                        <div className="col-span-2">CCT</div>
                        <div className="col-span-3 bg-gradient-to-r text-[#454343] font-extralight from-[#fffb97] via-white to-[#e1f8ff] px-3">
                          <div className="flex w-full justify-between">
                            <div>3000K</div>
                            <div>/</div>
                            <div>4500K</div>
                            <div>/</div>
                            <div>6500K</div>
                          </div>
                        </div>
                      </div>
                      {/* <TableRow>
                      <TableCell>CCT</TableCell>
                      <TableCell className="bg-gradient-to-r text-[#454343] font-extralight from-yellow-100 to-blue-100">
                        <div className="flex w-full justify-between">
                          <div>3000K</div>
                          <div>/</div>
                          <div>4500K</div>
                          <div>/</div>
                          <div>6500K</div>
                        </div>
                      </TableCell>
                    </TableRow> */}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-3 my-5">
                  <div>
                    <div className="rounded-md mb-3 text-xs font-[350]">
                      Colour Options
                    </div>
                    {/* <Separator className="mb-3" /> */}
                    <div className="flex flex-wrap gap-3">
                      {item.colorConfig &&
                        item!.colorConfig.map((values, i) => (
                          <div
                            className="max-w-9 flex-col items-center justify-center"
                            key={i}
                          >
                            <img
                              height={20}
                              width={20}
                              alt={values.colorName}
                              src={values.hexCode}
                              className={`mx-auto rounded-md h-7 w-7`}
                            />
                            <div className="text-[0.5rem] mt-1 text-center text-wrap text-[#454343] font-extralight">
                              {values.colorName}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <div className="rounded-md mb-3 text-xs font-[350]">
                      Beam Options
                    </div>
                    {/* <Separator className="mb-3" /> */}
                    <div className="flex flex-wrap gap-3">
                      {item.beamConfig &&
                        item!.beamConfig.map((values, i) => (
                          <div
                            className="max-w-9 flex-col items-center justify-center"
                            key={i}
                          >
                            <img
                              height={20}
                              width={20}
                              alt={values.beamName}
                              src={values.beamImg}
                              className={`mx-auto rounded-md h-7 w-7`}
                            />
                            <div className="text-[0.5rem] mt-1 text-center text-wrap text-[#454343] font-extralight">
                              {values.beamName}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-[75vh] w-full">
            <div className="flex gap-3">
              <Loader2 className="animate-spin" />
              Loading ..
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {/* <div className="md:hidden space-y-4">
        <div className="aspect-square bg-[#ebebeb] relative">
          <img
            src={images[currentImage]}
            alt="Product"
            className="w-full h-full object-cover"
          />
          <button
            onClick={handlePrevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 px-4">
          <h1 className="text-4xl font-normal text-gray-900">Flash</h1>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4].map((star) => (
                <svg
                  key={star}
                  className="w-5 h-5 text-black"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <svg
                className="w-5 h-5 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span className="text-gray-500">(1 customer review)</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-3xl font-normal">£245.00</span>
            <span className="text-3xl font-normal text-gray-400 line-through">
              £275.00
            </span>
          </div>
          <p className="text-gray-500 text-md">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco ommodo
            consequat. Duis aute irure dolor in reprehenderit dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident.
          </p>
          <div className="flex space-x-4">
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 border-r border-gray-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center"
              />
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-4 py-2 border-l border-gray-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button className="bg-black text-white px-8 py-2 rounded-md flex-1">
              Add to cart
            </button>
          </div>
        </div>
      </div> */}
      </div>
    </div>
  );
};

export default NewProductPage;
