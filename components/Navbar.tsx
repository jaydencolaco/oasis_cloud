"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);

  return (
    <>
      <header className="fixed w-full z-50">
        <div className="flex px-4 md:px-10 py-0 bg-[#fcfcfc] justify-between items-center w-full">
          <div className="relative w-[80px] h-[57px] md:w-[130px] md:h-[75px]">
            <Link rel="preload" href={"/"}>
              <Image
                priority
                rel="preload"
                src="/Oasis-Old-LogoPNG.png"
                alt="Oasis Luminaires"
                fill
                sizes="(max-width: 768px) 80px, (max-width: 1200px) 130px, 130px"
                className="object-contain"
              />
            </Link>
          </div>
          <button
            id="menu"
            aria-label=""
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
                  id="company"
                  aria-label="company"
                  onClick={() => setCompanyOpen(!companyOpen)}
                  className="text-3xl relative font-medium hover:no-underline group"
                >
                  Company
                  <span className="absolute left-0 bottom-0 w-0 group-hover:h-[2px] h-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </button>
                <div
                  className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${
                      companyOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }
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
    </>
  );
}
