"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OurServices() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchTerm);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center my-16 mb-8">
            <h2 className="text-4xl font-medium uppercase">Our Services</h2>
            <p className="uppercase tracking-widest font-light">
              Design and Engineering
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left Column */}

            {/* Right Column */}
            <div className="md:w-full pt-16">
              {/* <h1 className="text-4xl text-[#282828] m-[20px] font-bold font-poppins">
                Our Services
              </h1> */}

              <section className="mb-8">
                <h4 className="text-lg m-[20px] font-medium mb-0 font-poppins">
                  DESIGN AND ENGINEERING
                </h4>
                <section className="mb-8 m-[20px] ">
                  <p className="mb-4 font-extralight text-base pt-5 text-gray-500 ">
                    Our expertise in lighting, experience in industry and
                    enhanced engineering capabilities allow us to serve our
                    clients in several ways
                  </p>
                  <ul className="mb-4 font-extralight ml-[20px] text-base  text-gray-500 list-disc pl-5">
                    <li>
                      <strong>Luminaire Consultation:</strong> Consult us for
                      all your technical questions or concerns and to discover
                      cleanroom lighting best practices for your projects
                    </li>
                    <li>
                      <strong>Lighting Design:</strong> Comprehensive lighting
                      design reports, lighting distribution CAD layouts,
                      optimized capex and opex considerations
                    </li>
                    <li>
                      <strong>Customized Fabrication:</strong> We can engineer,
                      design and manufacture custom luminaires to fit your
                      technical needs
                    </li>
                  </ul>
                </section>
              </section>

              <section className="mb-8 m-[20px]">
                <h4 className="text-lg font-medium mb-4 font-poppins">
                  LIGHTING DESIGN (ARCHITECTURAL & INDUSTRIAL)
                </h4>
                <div className="mb-4 font-extralight text-base pt-5 text-gray-500 ">
                  <strong>1. TECHNICAL PLANNING </strong>
                  <br />
                  Analyze project requirements and needs based on following
                  considerations:
                  <ul className="mb-4 font-extralight ml-[20px] text-base  text-gray-500">
                    <li>• Luminaire Environment </li>
                    <li>• Need for Ingress and Impact Protection </li>
                    <li>• Ease of installation and maintenance</li>
                    <li>• Energy efficiency and Sustainability</li>
                  </ul>
                </div>
                <div className="mb-4 font-extralight text-base pt-5 text-gray-500 ">
                  <strong>2. PHOTOMETRIC CALCULATIONS </strong>
                  <br />
                  Comprehensive lighting design and distribution layout:
                  <ul className="mb-4 font-extralight ml-[20px] text-base  text-gray-500 ">
                    <li>• Lux levels optimization </li>
                    <li>• Glare control</li>
                    <li>• Lighting uniformity</li>
                    <li>• International standards compliant</li>
                    <li>• Lighting calculation heatmaps</li>
                  </ul>
                </div>
                <div className="mb-4 font-extralight text-base pt-5 text-gray-500 ">
                  <strong>3. 3D VISUALIZATION </strong>
                  <br />
                  Lighting Design results are presented in the form of realistic
                  3D models to aid visualization:
                  <ul className="mb-4 font-extralight ml-[20px] text-base  text-gray-500 ">
                    <li>• High quality 3D renders </li>
                    <li>
                      • Realistic outdoor and indoor illumination visualization
                    </li>
                    <li>• Fixture separation and Lighting layouts</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
