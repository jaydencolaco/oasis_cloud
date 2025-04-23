"use client";

import { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const SECTIONS = [
  {
    title: "Indoor",
    subtitle: "Residential | Commercial",
    image:
      "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742637860/HP1_w1j3ii.png",
    bgColor: "bg-[#cedceb]",
    link: "/products/indoor",
  },
  {
    title: "Outdoor",
    subtitle: "Façade | Landscape",
    image:
      "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742639104/OHP2_ohxjbd.png",
    bgColor: "bg-[#e0e0e0]",
    link: "/products/outdoor",
  },
  {
    title: "Industrial",
    subtitle: "Specialized Applications",
    image:
      "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742638141/OHP3_y6bwmv.png",
    bgColor: "bg-[#b2c0ce]",
    link: "/products/industrial",
  },
  {
    title: "Custom",
    subtitle: "Envisioned Design",
    image:
      "https://res.cloudinary.com/dcgsnlf1p/image/upload/v1742639378/OHP4_3_uuf8us.png",
    bgColor: "bg-[#ffd3d4]",
    link: "/products/custom",
  },
] as const;

export default function Home() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="fixed w-full z-50">
        <div className="flex px-4 md:px-10 py-3 justify-between items-center w-full">
          <div className="relative w-[80px] h-[57px] md:w-[130px] md:h-[75px]">
            <Link href={"/"} rel="preload">
              <Image
                src="/Oasis-Old-LogoPNG.png"
                alt="Oasis Luminaires"
                fill
                className="object-contain"
              />
            </Link>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-black hover:text-gray-700 transition-colors"
          >
            <motion.div
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <motion.div
                  whileHover={{ rotate: 45 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <X size={24} className="transition-all duration-300" />
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Menu size={24} className="transition-all duration-300" />
                </motion.div>
              )}
            </motion.div>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-85 z-40 flex items-center justify-center">
          <nav className="text-center">
            <ul className="space-y-4">
              <li>
                <Link
                  rel="preload"
                  className="relative text-3xl font-medium hover:no-underline group"
                  href={"/"}
                >
                  Home
                  <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>

              <li className="relative">
                <button
                  onClick={() => setCompanyOpen(!companyOpen)}
                  className="text-3xl relative font-medium hover:no-underline group"
                >
                  Company
                  <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </button>
                <div
                  className={`
                  overflow-hidden transition-all duration-300 ease-in-out
                  ${companyOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}
                `}
                >
                  <ul className="mt-4 space-y-4">
                    <li>
                      <Link
                        rel="preload"
                        className="relative text-xl font-medium hover:no-underline group"
                        href={"/about-us"}
                      >
                        About Us
                        <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        rel="preload"
                        className="relative text-xl font-medium hover:no-underline group"
                        href={"/our-services"}
                      >
                        Our Services
                        <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>

              <li>
                <Link
                  rel="preload"
                  className="relative text-3xl font-medium hover:no-underline group"
                  href={"/products"}
                >
                  Products
                  <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  rel="preload"
                  className="relative text-3xl font-medium hover:no-underline group"
                  href={"/downloads"}
                >
                  Downloads
                  <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
              <li>
                <Link
                  rel="preload"
                  className="relative text-3xl font-medium hover:no-underline group"
                  href={"/contact"}
                >
                  Contact
                  <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}

      <main className="relative min-h-screen grid grid-cols-1 md:grid-cols-4 gap-0 z-10">
        {SECTIONS.map((section, index) => (
          <div
            key={section.title}
            className={`relative h-[40vh] md:h-screen w-full group cursor-pointer border-gray-300 border-r-[1px] ${
              section.bgColor
            } 
            ${activeSection === index ? "bg-opacity-100" : "bg-opacity-0"} 
            transition-colors duration-500`}
            onMouseEnter={() => setActiveSection(index)}
            onMouseLeave={() => setActiveSection(0)}
            onTouchStart={() => setActiveSection(index)}
            onTouchEnd={() => setActiveSection(0)}
          >
            <div className="md:hidden absolute inset-0 w-full h-full overflow-hidden">
              <Image
                src={section.image}
                alt={section.title}
                fill
                className={`object-scale-down transition-transform duration-500 ${
                  activeSection === index ? "scale-100" : "opacity-0"
                }`}
              />
            </div>

            <div className="hidden md:block fixed inset-0 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 1, y: 0 }}
                animate={
                  activeSection === index
                    ? { opacity: 1, scale: 1, x: -10 }
                    : { opacity: 0, scale: 1, x: 10 }
                }
                transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover scale-100"
                  priority
                />
              </motion.div>
            </div>

            <Link
              href={section.link}
              className="relative z-10 h-full flex flex-col justify-end items-left p-14"
            >
              <div
                className={`text-left mb-3 transition-colors duration-500 ${
                  activeSection === index ? "text-white" : "text-black"
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-medium mb-2">
                  {section.title}
                </h2>
                <h4
                  className={`text-sm md:text-md font-light transition-colors duration-500 ${
                    activeSection === index ? "text-white" : "text-black"
                  }`}
                >
                  {section.subtitle}
                </h4>
                <div
                  className={`transform text-sm gap-3 md:text-md group flex mt-4 hover:underline translate-y-2 opacity-0 group-hover:opacity-100 
                md:group-hover:translate-y-0 transition-all duration-300 ${
                  activeSection === index ? "text-white" : "text-black"
                }`}
                >
                  <div
                    className={`${
                      activeSection === index ? "translate-x-1 my-auto" : ""
                    } duration-500`}
                  >
                    <ArrowRight size={15} />
                  </div>
                  View Collection
                </div>
              </div>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
