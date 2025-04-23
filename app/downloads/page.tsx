"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Brochure {
  id: string;
  title: string;
  description: string;
  image: string;
  downloadUrl: string;
}

const brochures: Brochure[] = [
  {
    id: "1",
    title: "Company Profile",
    description: "Learn more about us, our journey so far and what we do.",
    image: "/downloads/firstpageimg.jpg",
    downloadUrl: "/downloads/oasis.pdf",
  },
  {
    id: "2",
    title: "Outdoor Lighting Product Portfolio",
    description: "⁠Explore our latest portfolio of outdoor lighting products.",
    image: "/downloads/oasisfinal_removed_page-0001.jpg",
    downloadUrl: "/downloads/oasisfinal.pdf",
  },
  {
    id: "3",
    title: "Indoor Lighting Product Portfolio",
    description: "⁠Explore our latest portfolio of indoor lighting products.",
    image: "/downloads/download3.png",
    downloadUrl: "/downloads/IndoorLightingProductPortfolio.pdf",
  },
  {
    id: "4",
    title: "Cleanroom Lighting Product Catalog",
    description:
      "⁠Explore our lighting solutions for cleanroom and industrial environments.",
    image: "/downloads/download4.png",
    downloadUrl: "/downloads/CleanroomLightingProdcutCatalog.pdf",
  },
  {
    id: "5",
    title: "Super Smart Super Slim Magnetic Track - Commercial",
    description:
      "⁠Introducing the latest range of stylish and smart magnetic track lights for commercial spaces.",
    image: "/downloads/commercial.svg",
    downloadUrl: "/downloads/Commercial.pdf",
  },
  {
    id: "6",
    title: "Super Smart Super Slim Magnetic Track - Residential",
    description:
      "⁠Introducing the latest range of stylish and smart magnetic track lights for residential spaces.",
    image: "/downloads/residential.svg",
    downloadUrl: "/downloads/Residential.pdf",
  },
  {
    id: "7",
    title: "Hybrid Belt and Track System",
    description:
      "⁠Hybrid lighting systems that work with belt tracks and magnetic tracks.",
    image: "/downloads/firstpageimg.jpg",
    downloadUrl: "/downloads/HybridBeltandTrackSystem.pdf",
  },
  {
    id: "8",
    title: "Oasis Smart Pole",
    description:
      "⁠Discover the Oasis Smart Lighting Pole with innovative, feature-heavy components",
    image: "/downloads/download8.png",
    downloadUrl: "/downloads/SmartPole.pdf",
  },
];

export default function DownloadsPage() {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="mx-auto sm:max-w-[80%] max-w-[90%] px-2 py-16 sm:px-6 lg:px-8">
          <div className="text-center my-16 mb-32">
            <h2 className="text-4xl font-medium uppercase">
              Company Resources
            </h2>
            <p className="uppercase tracking-widest font-light">
              Download our latest brochures and learn more about what we do
            </p>
            {/* <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Company Resources
            </h1> */}
            {/* <p className="mt-4 text-lg text-gray-500">
              Download our latest brochures and learn more about what we do
            </p> */}
          </div>

          <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-3">
            {brochures.map((brochure) => (
              <motion.div
                key={brochure.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="group relative overflow-hidden rounded-none bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden object-contain">
                  <Image
                    src={brochure.image}
                    alt={brochure.title}
                    width={600}
                    height={400}
                    className="h-full w-full rounded-none object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-2">
                  <h3 className="uppercase tracking-widest font-light text-gray-900 group-hover:text-gray-600 transition-colors">
                    {brochure.title}
                  </h3>
                  {/* <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                    {brochure.title}
                  </h3> */}
                  <p className="mt-2 text-gray-500">{brochure.description}</p>
                  <motion.a
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    href={brochure.downloadUrl}
                    target="_blank" // Open in new screen
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
