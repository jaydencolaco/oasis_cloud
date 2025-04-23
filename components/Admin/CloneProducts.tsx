"use client";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import {
  Camera,
  ChevronLeft,
  Loader2,
  Trash,
  TriangleAlert,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "sonner";
import { Toaster } from "../ui/sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import Login from "../Login";
import Image from "next/image";
import { Separator } from "../ui/separator";
import { Beam, Color } from "./AdminPage";
import Link from "next/link";

const CloneProducts = ({ id }: { id: string }) => {
  const mainId = id
    .split("_")
    .map((word) => word.toUpperCase())
    .join(" ");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  // const [mainImg, setMainImg] = useState<String | undefined>(undefined);
  const [mainImg, setMainImg] = useState<string>("");
  const [subImg, setSubImg] = useState<string[]>([]);
  const [category, setCategory] = useState<string>("");
  const [subCategoryL1, setSubCategoryL1] = useState<string>("");
  const [subCategoryL2, setSubCategoryL2] = useState<string>("");
  const [wattage, setWattage] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [details, setDetails] = useState<
    {
      type: string | undefined;
      value: string | undefined;
    }[]
  >([]);
  const [detType, setDetType] = useState<string | undefined>("");
  const [detValue, setDetValue] = useState<string | undefined>("");
  const [features, setFeatures] = useState<string>("");
  const [dimensions, setDimensions] = useState<string>("");
  const [colorConfig, setColorConfig] = useState<Color[]>([]);
  const [beamConfig, setBeamConfig] = useState<Beam[]>([]);
  const [dimensionInfo, setAccessories] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const [userAuth, setUserAuth] = useState<User | null>(null);
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

  useEffect(() => {
    const fetchDocs = async () => {
      if (!mainId) return;
      try {
        console.log(mainId);
        const userRef = doc(db, "products", mainId as string);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.name !== undefined) setName(data.name);
          if (data.code !== undefined) setCode(data.code);
          if (data.mainImg !== undefined) setMainImg(data.mainImg);
          if (data.subImg !== undefined) setSubImg(data.subImg);
          if (data.category !== undefined) setCategory(data.category);
          if (data.subCategoryL1 !== undefined)
            setSubCategoryL1(data.subCategoryL1);
          if (data.subCategoryL2 !== undefined)
            setSubCategoryL2(data.subCategoryL2);
          if (data.wattage !== undefined) setWattage(data.wattage);
          if (data.description !== undefined) setDescription(data.description);
          if (data.details !== undefined) setDetails(data.details);
          if (data.features !== undefined) setFeatures(data.features);
          if (data.dimensions !== undefined) setDimensions(data.dimensions);
          if (data.colorConfig !== undefined) setColorConfig(data.colorConfig);
          if (data.beamConfig !== undefined) setBeamConfig(data.beamConfig);
          if (data.dimensionInfo !== undefined)
            setAccessories(data.dimensionInfo);
          if (data.price !== undefined) setPrice(data.price);
        } else {
          console.log("No such document!");
        }
      } catch (err: any) {
        console.error("Error fetching document:", err.message);
      }
    };
    fetchDocs();
  }, [mainId]);

  const truncate = (str: string | null, length: number) => {
    if (!str || str.length <= length) return str;
    return `${str.slice(0, length - 3)}...`;
  };

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
    "Hybrid Belt & Magnetic Track System",
    "Magnetic Track System",
    "Hanging Light System / Belt & Track System",
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

  const addEntry = () => {
    if (!detType || !detValue) {
      alert("Start date and salary are required.");
      return;
    }

    setDetails((prevEntries: any) => [
      ...prevEntries,
      { type: detType, value: detValue },
    ]);

    // Clear inputs
    setDetType("");
    setDetValue("");
  };

  const handleDeleteDetail = (index: number) => {
    setDetails((prevEntries: any) =>
      prevEntries.filter((_: any, i: any) => i !== index)
    );
  };

  const color = [
    {
      hexCode: "/products/OUT_GG.jpg",
      colorName: "Graphite Grey",
    },
    {
      hexCode: "/products/OUT_SB.jpg",
      colorName: "Sand Black",
    },
    {
      hexCode: "/products/OUT_WB.jpg",
      colorName: "Wood Brown",
    },
    {
      hexCode: "/products/OUT_MS.jpg",
      colorName: "Moon Stone",
    },
    {
      hexCode: "/products/OUT_SS.jpg",
      colorName: "Silver Sand",
    },
    {
      hexCode: "/products/OUT_TAN.jpg",
      colorName: "Tangerine",
    },
    {
      hexCode: "/products/OUT_PW.jpg",
      colorName: "Dutch White",
    },
    {
      hexCode: "/products/OUT_PW.jpg",
      colorName: "Opal White",
    },
    {
      hexCode: "/products/IN_CC.png",
      colorName: "Copper Chrome",
    },
    {
      hexCode: "/products/IN_SB.png",
      colorName: "Onyx Black",
    },
    {
      hexCode: "/products/IN_CB.png",
      colorName: "Chrome Black",
    },
    {
      hexCode: "/products/IN_CG.png",
      colorName: "Chrome Gold",
    },
    {
      hexCode: "/products/IN_PW.png",
      colorName: "Pearl White",
    },
    {
      hexCode: "/products/IN_MB.png",
      colorName: "Matte Brass",
    },
    {
      hexCode: "/products/IN_RG.png",
      colorName: "Rose Gold",
    },
    {
      hexCode: "/products/IN_GB.png",
      colorName: "Gun Black",
    },
    {
      hexCode: "/products/IN_CS.png",
      colorName: "Chrome Silver",
    },
  ];

  const beam = [
    {
      beamName: "Very Narrow",
      beamVar: "BC_VN_PF_CL_ING_WW_UNW_All",
      beamImg: "/beam/BCPF220.jpg",
    },
    {
      beamName: "Narrow",
      beamVar: "BC_N_PF_CL_ING_WW_UNW_All",
      beamImg: "/beam/BCPF221.jpg",
    },
    {
      beamName: "Medium",
      beamVar: "BC_M_PF_CL_ING_WW_UNW_All",
      beamImg: "/beam/BCPF222.jpg",
    },
    {
      beamName: "Wide",
      beamVar: "BC_W_PF_CL_ING_WW_UNW_All",
      beamImg: "/beam/BCPF223.jpg",
    },
    {
      beamName: "Eliptical",
      beamVar: "BC_EL_PF_CL_ING_WW_All",
      beamImg: "/beam/BCPF224.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_DT_BLL_ARK",
      beamImg: "/beam/BCBLLARK.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_HAL",
      beamImg: "/beam/BCBLL3602.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_CAPT",
      beamImg: "/beam/BCBLL3602.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_DT_BLL_CAPS",
      beamImg: "/beam/BCBLLSPI180.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_NOV",
      beamImg: "/beam/BCBLL360.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_BAS",
      beamImg: "/beam/BCBLL3603.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_180_BLL_CYC",
      beamImg: "/beam/BCBLLCYC.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_TRO",
      beamImg: "/beam/BCBLL3603.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_FW/BW_BLL_SEN",
      beamImg: "/beam/BCBLLSEN.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_POL",
      beamImg: "/beam/BCBLLPOL.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_360_BLL_POL2",
      beamImg: "/beam/BCBLLPOL2.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_180_BLL_SPI",
      beamImg: "/beam/BCBLLSPI180.jpg",
    },
    {
      beamName: "Standard",
      beamVar: "BC_180_BLL_SPI_FV",
      beamImg: "/beam/BCBLLSPI1F.jpg",
    },
    {
      beamImg: "/beam/BCBLLVAN2.jpg",
      beamVar: "BC_FW/BW_BLL_VAN2",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLVAN.jpg",
      beamVar: "BC_FW_BLL_VAN",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLVAN.jpg",
      beamVar: "BC_FW_BLL_BIS",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLBAM.jpg",
      beamVar: "BC_DT_BLL_BAM",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLVAN.jpg",
      beamVar: "BC_FW_BLL_ORB",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLT3.jpg",
      beamVar: "BC_T3_BLL_ORT120",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLEVO.jpg",
      beamVar: "BC_DT_BLL_EVO",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLSET.jpg",
      beamVar: "BC_DT_BLL_SET",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLT2.jpg",
      beamVar: "BC_T2_BLL_ORT90",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLMO.jpg",
      beamVar: "BC_FW_BLL_MO",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLFL.jpg",
      beamVar: "BC_T3_BLL_FLA",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLOR60.jpg",
      beamVar: "BC_FW_BLL_ORT60",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLORI.jpg",
      beamVar: "BC_360/FW_BLL_ORI",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLAX.jpg",
      beamVar: "BC_BLL_AXI",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLVES.jpg",
      beamVar: "BC_FW_BLL_VES1/2",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLVES2.jpg",
      beamVar: "BC_BLL_VES2",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCBLLSPI.jpg",
      beamVar: "BC_FW_BLL_SPI90",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCSL_T1.png",
      beamVar: "BC_T1_SL_ALL",
      beamName: "Type 1",
    },
    {
      beamImg: "/beam/BCSL_T2.png",
      beamVar: "BC_T2_SL_ALL",
      beamName: "Type 2",
    },
    {
      beamImg: "/beam/BCSL_T3.png",
      beamVar: "BC_T3_SL_ALL",
      beamName: "Type 3",
    },
    {
      beamImg: "/beam/BCSL_T4.png",
      beamVar: "BC_T4_SL_ALL",
      beamName: "Type 4",
    },
    {
      beamImg: "/beam/BCPT_M.jpg",
      beamVar: "BC_M_PT",
      beamName: "Medium",
    },
    {
      beamImg: "/beam/BCPT_W.jpg",
      beamVar: "BC_W_PT",
      beamName: "Wide",
    },
    {
      beamImg: "/beam/BCPT_O.jpg",
      beamVar: "BC_O_PT",
      beamName: "Oval",
    },
    {
      beamImg: "/beam/BCCL_BE.jpg",
      beamVar: "BC_CL_BE",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCCL_HE.jpg",
      beamVar: "BC_CL_HE",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCCL_POXL.jpg",
      beamVar: "BC_CL_POXL",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCCL_CIT.jpg",
      beamVar: "BC_CL_CIT",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCING_WW.png",
      beamVar: "BC_ING_WW",
      beamName: "Wall Washer",
    },
    {
      beamImg: "/beam/BCWW_VN.jpg",
      beamVar: "BC_WW_VN",
      beamName: "Very narrow",
    },
    {
      beamImg: "/beam/BCWW_N.jpg",
      beamVar: "BC_WW_N",
      beamName: "Narrow",
    },
    {
      beamImg: "/beam/BCWW_M.jpg",
      beamVar: "BC_WW_M",
      beamName: "Medium",
    },
    {
      beamImg: "/beam/BCWW_W.jpg",
      beamVar: "BC_WW_W",
      beamName: "Wide",
    },
    {
      beamImg: "/beam/BCWW_EL.jpg",
      beamVar: "BC_WW_EL",
      beamName: "Eliptical",
    },
    {
      beamImg: "/beam/BCPL_VN.png",
      beamVar: "BC_PL_VN",
      beamName: "Very narrow",
    },
    {
      beamImg: "/beam/BCPL_N.png",
      beamVar: "BC_PL_N",
      beamName: "Narrow",
    },
    {
      beamImg: "/beam/BCPL_M.png",
      beamVar: "BC_PL_M",
      beamName: "Medium",
    },
    {
      beamImg: "/beam/BCPL_W.png",
      beamVar: "BC_PL_W",
      beamName: "Wide",
    },
    {
      beamImg: "/beam/BCFL_DIF.png",
      beamVar: "BC_FL_DIF",
      beamName: "Diffused",
    },
    {
      beamImg: "/beam/BCRCWL.png",
      beamVar: "BC_WL_NX_WXRS_WXRR",
      beamName: "Foward Throw",
    },
    {
      beamImg: "/beam/BCWL_N.jpg",
      beamVar: "BC_WL_TW_N",
      beamName: "Narrow",
    },
    {
      beamImg: "/beam/BCWL_M.jpg",
      beamVar: "BC_WL_TW_M",
      beamName: "Medium",
    },
    {
      beamImg: "/beam/BCWL_W.jpg",
      beamVar: "BC_WL_TW_W",
      beamName: "Wide",
    },
    {
      beamImg: "/beam/BCWLN_OW.png",
      beamVar: "BC_WL_OW_N",
      beamName: "Narrow",
    },
    {
      beamImg: "/beam/BCWLM_OW.jpg",
      beamVar: "BC_WL_OW_M",
      beamName: "Medium",
    },
    {
      beamImg: "/beam/BCWLW_OW.jpg",
      beamVar: "BC_WL_OW_W",
      beamName: "Wide",
    },
    {
      beamImg: "/beam/BCWL_PN.png",
      beamVar: "BC_WL_PN_S",
      beamName: "Side Beam",
    },
    {
      beamImg: "/beam/BCWLPN_F.png",
      beamVar: "BC_WL_PN_F",
      beamName: "Front Beam",
    },
    {
      beamImg: "/beam/BCWL_2DX.png",
      beamVar: "BC_WL_2DX",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCWLOM_S.png",
      beamVar: "BC_WL_OM_S",
      beamName: "Side Beam",
    },
    {
      beamImg: "/beam/BCWLOM_F.png",
      beamVar: "BC_WL_OM_F",
      beamName: "Front Beam",
    },
    {
      beamImg: "/beam/BCWLDL_N.png",
      beamVar: "BC_WL_DL_N",
      beamName: "Narrow",
    },
    {
      beamImg: "/beam/BCWLDL_VN.png",
      beamVar: "BC_WL_DL_VN",
      beamName: "Very Narrow",
    },
    {
      beamImg: "/beam/BCWLDL_M.png",
      beamVar: "BC_WL_DL_M",
      beamName: "Medium",
    },
    {
      beamImg: "/beam/BCWLDL_W.png",
      beamVar: "BC_WL_DL_W",
      beamName: "Wide",
    },
    {
      beamImg: "/beam/BCWLSL_F.png",
      beamVar: "BC_WL_SL_F",
      beamName: "Front Beam",
    },
    {
      beamImg: "/beam/BCWLSL_S.png",
      beamVar: "BC_WL_SL_S",
      beamName: "Side Beam",
    },
    {
      beamImg: "/beam/BCWLQD_F.png",
      beamVar: "BC_WL_CR_S",
      beamName: "Front Beam",
    },
    {
      beamImg: "/beam/BCWLQD_S.png",
      beamVar: "BC_WL_QD_S1",
      beamName: "Side Beam",
    },
    {
      beamImg: "/beam/BCWLT1.png",
      beamVar: "BC_WL_CAR_T1",
      beamName: "Type 1",
    },
    {
      beamImg: "/beam/BCWLT2.png",
      beamVar: "BC_WL_CAR_T2",
      beamName: "Type 2",
    },
    {
      beamImg: "/beam/BCWLT3.png",
      beamVar: "BC_WL_CAR_T3",
      beamName: "Type 3",
    },
    {
      beamImg: "/beam/BCCL_DT.jpg",
      beamVar: "BC_WL_SKYP_SKYBX",
      beamName: "Standard",
    },
    {
      beamImg: "/beam/BCING_OVD1.png",
      beamVar: "BC_ING_OVD1",
      beamName: "One Way",
    },
    {
      beamImg: "/beam/BCING_OVD2.png",
      beamVar: "BC_ING_OVD2",
      beamName: "Two Way",
    },
    {
      beamImg: "/beam/BCING_OVD4.png",
      beamVar: "BC_ING_OVD4",
      beamName: "Four Way",
    },
    {
      beamImg: "/beam/BCFLX.png",
      beamVar: "BC_FLX",
      beamName: "Flex",
    },
    {
      beamName: "Standard",
      beamVar: "BC_WSL",
      beamImg: "/beam/BCLINK.png",
    },
    {
      beamName: "BCUP",
      beamVar: "BC_MPP_BC_PO",
      beamImg: "/beam/BCFLD_1.png",
    },
    {
      beamName: "OMNI",
      beamVar: "BC_MPP_OMNI",
      beamImg: "/beam/BCFLD_2.png",
    },
  ];

  useEffect(() => {
    if (Array.isArray(colorConfig)) {
      setSelectedColors(colorConfig.map((c) => c.colorName));
    }
  }, [colorConfig]);

  useEffect(() => {
    console.log(beamConfig);
    if (Array.isArray(beamConfig)) {
      setSelectedBeams(beamConfig.map((b) => b.beamVar));
    }
  }, [beamConfig]);

  const [selectedBeams, setSelectedBeams] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleBeam = (beamVar: string) => {
    setSelectedBeams((prev) =>
      prev.includes(beamVar)
        ? prev.filter((b) => b !== beamVar)
        : [...prev, beamVar]
    );
  };
  const toggleColor = (beamVar: string) => {
    setSelectedColors((prev) =>
      prev.includes(beamVar)
        ? prev.filter((b) => b !== beamVar)
        : [...prev, beamVar]
    );
  };

  const getSelectedBeamDetails = () => {
    return beam.filter((beam) => selectedBeams.includes(beam.beamVar));
  };
  const getSelectedColorDetails = () => {
    return color.filter((beam) => selectedColors.includes(beam.colorName));
  };

  const cloneProd = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    console.log(subCategoryL2);
    const selectedBeamDetails: Beam[] = getSelectedBeamDetails();
    setBeamConfig(selectedBeamDetails);
    const selectedColorDetails: Color[] = getSelectedColorDetails();
    setColorConfig(selectedColorDetails);
    if (id) {
      try {
        const userRef = doc(db, "products", name);
        await setDoc(userRef, {
          name: name,
          code: code,
          mainImg: mainImg,
          subImg: subImg,
          category: category,
          subCategoryL1: subCategoryL1,
          subCategoryL2: subCategoryL2 ? subCategoryL2 : "",
          wattage: wattage,
          description: description ? description : "",
          details: details,
          features: features,
          dimensions: dimensions,
          colorConfig: selectedColorDetails,
          beamConfig: selectedBeamDetails,
          dimensionInfo: dimensionInfo,
          price: price ? price : "",
          deactivate: false,
          timestamp: serverTimestamp(),
        });
        setIsLoading(false);
        toast("Successfully Added New Product", {
          description: "A new product has been added",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
        e.target.reset();
      } catch (error) {
        console.log(error);
        toast("Error Adding New Product", {
          description: `${error}`,
        });
      }
    }
  };

  const [files, setFiles] = useState<(File | null)[]>([null, null, null]);
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newFiles = [...files];
    newFiles[index] = e.target.files ? e.target.files[0] : null;
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    const updatedSubImg = [...subImg];

    for (let i = 0; i < files.length; i++) {
      if (!files[i]) continue;

      const formData = new FormData();
      formData.append("file", files[i]!); // "!" to ensure TypeScript knows it's not null

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        updatedSubImg[i] = response.data.url;
        console.log(`File ${i + 1} uploaded successfully`, response.data);
        toast("Successfully Uploaded Images", {
          description: "Images have been uploaded",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
      } catch (error) {
        console.error(`Error uploading file ${i + 1}`, error);
        toast("Error Uploaded Images", {
          description: "Try again later",
          action: {
            label: "Done",
            onClick: () => console.log("Done"),
          },
        });
      }
    }

    setSubImg(updatedSubImg);
    if (updatedSubImg[0]) {
      setMainImg(updatedSubImg[0]);
    }
  };
  return (
    <div>
      <Toaster />
      {userAuth ? (
        <div>
          <div className="md:w-[80%] w-[90%] py-10 mx-auto">
            <div className="flex gap-3">
              <Link rel="preload" href={"/admin"}>
                <Button type="button">
                  <ChevronLeft />
                  Back
                </Button>
              </Link>
              <h2 className="font-bold my-auto text-xl">Clone Product</h2>
            </div>
            <Separator />
            {name ? (
              <form onSubmit={cloneProd}>
                <div className="grid sm:grid-cols-2 my-3 gap-2">
                  <div className="space-y-1 sm:my-1">
                    <Label>Product Name</Label>
                    <Input
                      name="name"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value.toUpperCase());
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1 sm:my-1">
                    <Label>Product Code</Label>
                    <Input
                      name="name"
                      value={code}
                      onChange={(e: any) => {
                        setCode(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-5 sm:my-1">
                  <Label>3 Images</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {subImg.map((val, i) => (
                      <div
                        key={i}
                        className="relative aspect-square bg-muted ring-2 ring-primary"
                      >
                        <Image
                          src={
                            val ||
                            "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742583368/2_y1t5dw.png"
                          }
                          alt={"hi"}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex sm:flex-row flex-col gap-3 mt-3">
                    <Button disabled variant={"outline"}>
                      <Camera />
                    </Button>
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, 0)}
                    />
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, 1)}
                    />
                    <Input
                      type="file"
                      onChange={(e) => handleFileChange(e, 2)}
                    />
                    <Button
                      className=""
                      type="button"
                      variant={"oasis"}
                      onClick={handleUpload}
                    >
                      Upload Pictures
                    </Button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="space-y-1 my-2">
                    <Label>Main Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Main Category" />
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
                  <div className="space-y-1 my-2">
                    <Label>Sub-Category L1</Label>
                    <Select
                      value={subCategoryL1}
                      onValueChange={(value) => setSubCategoryL1(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Main Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {category == "Indoor"
                            ? indoor.map((values, i) => (
                                <SelectItem key={i} value={values}>
                                  {values}
                                </SelectItem>
                              ))
                            : category == "Outdoor"
                            ? outdoor.map((values, i) => (
                                <SelectItem key={i} value={values}>
                                  {values}
                                </SelectItem>
                              ))
                            : category == "Industrial"
                            ? industrial.map((values, i) => (
                                <SelectItem key={i} value={values}>
                                  {values}
                                </SelectItem>
                              ))
                            : industrial.map((values, i) => (
                                <SelectItem key={i} value={values}>
                                  Waiting for Custom Categories
                                </SelectItem>
                              ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 my-2">
                    <Label>Sub-Category L2</Label>
                    <Input
                      name="name"
                      value={subCategoryL2}
                      onChange={(e: any) => {
                        setSubCategoryL2(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1 my-2">
                  <Label>Product Description</Label>
                  <Textarea
                    name="message"
                    rows={4}
                    id=""
                    value={description}
                    onChange={(e: any) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-2">
                  <div className="space-y-1 sm:my-1">
                    <Label>Dimensions</Label>
                    <Input
                      name="name"
                      value={dimensions}
                      onChange={(e: any) => {
                        setDimensions(e.target.value);
                      }}
                    />
                  </div>
                  <div className="space-y-1 sm:my-1">
                    <Label>Wattage</Label>
                    <Input
                      name="name"
                      type="text"
                      value={wattage}
                      onChange={(e: any) => {
                        setWattage(e.target.value);
                      }}
                      required
                    />
                  </div>
                  <div className="space-y-1 sm:my-1">
                    <Label>Product Price</Label>
                    <Input
                      name="name"
                      value={price}
                      onChange={(e: any) => {
                        setPrice(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-1 my-2">
                  <Label>
                    Features (seperate with an _ for a new bullet point)
                  </Label>
                  <Textarea
                    name="message"
                    rows={4}
                    id=""
                    value={features}
                    onChange={(e: any) => {
                      setFeatures(e.target.value);
                    }}
                    required
                  />
                </div>
                <div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Input
                        id="name"
                        value={detType}
                        onChange={(e) => setDetType(e.target.value)}
                        placeholder=" "
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        id="name"
                        value={detValue}
                        onChange={(e) => setDetValue(e.target.value)}
                        placeholder=" "
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end my-2">
                    <Button
                      className=""
                      type="button"
                      variant={"oasis"}
                      onClick={addEntry}
                    >
                      Add
                    </Button>
                  </div>

                  {details.length > 0 ? (
                    <Card>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead className="text-right">Delete</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {details.map((item, i) => (
                            <TableRow key={i}>
                              <TableCell>{item.type}</TableCell>
                              <TableCell>{item.value}</TableCell>
                              <TableCell className="text-red-600 text-right">
                                <Button
                                  type="button"
                                  onClick={() => handleDeleteDetail(i)}
                                >
                                  <Trash />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Card>
                  ) : (
                    ""
                  )}
                </div>
                <div className="grid sm:grid-cols-2 my-3 gap-2">
                  <div>
                    <div className="space-y-1 sm:my-1">
                      <Label>
                        Colors (For Edit you will have to select the colors
                        again) - Ref Below
                      </Label>
                      <div className="grid sm:grid-cols-3 grid-cols-2 gap-3">
                        {color.map((val, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Checkbox
                              value={val.colorName}
                              id={val.colorName}
                              checked={selectedColors.includes(val.colorName)}
                              onCheckedChange={() => toggleColor(val.colorName)}
                            />
                            <Label>{val.colorName}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-5 my-5">
                      <div>
                        <div className="rounded-md mb-1 text-md font-medium">
                          Colour Options
                        </div>
                        <Separator className="mb-3" />
                        <div className="flex flex-wrap gap-3">
                          {colorConfig &&
                            colorConfig?.map((values, i) => (
                              <div
                                className="max-w-14 flex-col items-center justify-center"
                                key={i}
                              >
                                <Image
                                  priority
                                  height={20}
                                  width={20}
                                  alt={values.colorName}
                                  src={values.hexCode}
                                  className={`mx-auto rounded-md h-10 w-10`}
                                />
                                <div className="text-xs mt-1 text-center text-wrap text-gray-400">
                                  {values.colorName}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <div className="rounded-md mb-1 text-md font-medium">
                          Beam Options
                        </div>
                        <Separator className="mb-3" />
                        <div className="flex flex-wrap gap-3">
                          {beamConfig &&
                            beamConfig?.map((values, i) => (
                              <div
                                className="max-w-14 flex-col items-center justify-center"
                                key={i}
                              >
                                <Image
                                  priority
                                  height={20}
                                  width={20}
                                  alt={values.beamName}
                                  src={values.beamImg}
                                  className={`mx-auto rounded-md h-10 w-10`}
                                />
                                <div className="text-xs mt-1 text-center text-wrap text-gray-400">
                                  {values.beamName}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 sm:my-1">
                    <Label>
                      Beam Configurations (Select the Beams again) - Ref Below
                    </Label>
                    <div className="grid sm:grid-cols-3 grid-cols-2 gap-3">
                      {beam.map((beam, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <Checkbox
                            value={beam.beamVar}
                            id={beam.beamVar}
                            checked={selectedBeams.includes(beam.beamVar)}
                            onCheckedChange={() => toggleBeam(beam.beamVar)}
                          />
                          <Label>{truncate(beam.beamVar, 16)}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 my-2">
                  <Label>Dimensions Info</Label>
                  <Input
                    name="name"
                    value={dimensionInfo}
                    onChange={(e: any) => {
                      setAccessories(e.target.value);
                    }}
                  />
                </div>
                <div className="mt-3">
                  {isLoading ? (
                    <Button disabled>
                      <Loader2 className="animate-spin" />
                      Cloning
                    </Button>
                  ) : (
                    <Button type="submit">Clone Product</Button>
                  )}
                </div>
              </form>
            ) : (
              <div className="flex justify-center items-center text-black h-[75vh] w-full">
                <div className="flex gap-3">
                  <TriangleAlert className="text-yellow-600" />
                  No Products in this Category
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default CloneProducts;
