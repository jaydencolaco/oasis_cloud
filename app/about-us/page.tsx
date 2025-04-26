"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import { Carousel } from "@/components/ui/carousel";
import ChatComponent from "@/components/ChatComponent";

export default function AboutUs() {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("what-we-do");
      if (section) {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
          setIsInView(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar />
      {/* <section id="about-us">
        <div
          className="relative h-[400px] bg-fixed bg-cover bg-center "
          style={{ backgroundImage: "url('/main-home-slide-2.jpg')" }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-5xl font-medium mt-24 text-white">About Us</h1>
          </div>
        </div>
      </section> */}
      <section
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16"
        id="company-history"
      >
        <div className="container mx-auto px-16">
          <div className="text-center my-16 mb-16">
            <h2 className="text-4xl font-medium uppercase">Company</h2>
            <p className="uppercase tracking-widest font-light">
              History And Origins
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-500">
              <div className="md:order-1">
                <p className="text-justify">
                  OASIS is a pioneer and a thought leader in the Indian lighting
                  Industry with over 30 years of experience providing
                  comprehensive lighting solutions. Our carefully curated,
                  extensive range of products enable us to serve client needs
                  from various industries and verticals locally, nationally and
                  globally. We strive to craft not only quality products but
                  also beautiful spaces that elevate human life.
                </p>
              </div>
              <div className="md:order-2">
                <p className="text-justify">
                  We are committed to crafting high-quality luminaires that are
                  efficient and effective. All of our luminaires are built from
                  high-quality materials and reliable parts. Each product goes
                  through a rigorous Quality Control process to ensure they meet
                  our performance and quality standards. Service and Integrity
                  are a core part of our corporate values.
                </p>
              </div>
            </div>
          </div>
          <div className="w-full mt-6 mb-12 md:mt-0  py-8">
            <Image
              src="/Frame-15.png"
              alt="Company History"
              width={1024}
              height={556}
              className="w-full"
            />
          </div>
        </div>
      </section>

      <section
        id="video"
        className="relative h-[600px] bg-fixed bg-cover bg-center"
        style={{ backgroundImage: "url('/parallax.jpeg')" }}
      ></section>

      <section className="min-h-screen bg-white pt-32" id="Our clients">
        <div className="container mx-auto px-0">
          <div className="text-center my-8">
            <h2 className="text-4xl font-medium uppercase">OUR CLIENTS</h2>
            <p className="uppercase tracking-widest font-light">
              TRUSTED BY GREAT BRANDS
            </p>
          </div>
          <div className="flex justify-center items-center overflow-hidden">
            <Carousel className="w-full h-[70vh] sm:h-[40vh] md:h-[80vh] lg:h-[70vh] bg-contain">
              {/* Slide 1 */}
              <div className="w-full h-[70vh] flex items-center justify-center relative">
                <Image
                  src="/Group23.png"
                  alt="Banner"
                  width={1600}
                  height={600}
                  className="w-[90%] h-full object-contain"
                />
              </div>
              {/* <div className="w-full h-[700px] flex items-center justify-center relative">
                <Image
                  src="/Group23.png"
                  alt="Banner"
                  layout="responsive"
                  width={1600}
                  height={600}
                />
              </div> */}

              {/* Slide 3 */}

              {/* <div className="w-full h-[700px] bg-cover bg-center flex items-center justify-center">
                <Image
                  src="/Group23.png"
                  alt="Banner"
                  layout="responsive"
                  width={1600}
                  height={600}
                />
              </div> */}
            </Carousel>
          </div>
        </div>
      </section>

      <section className="min-h-screen bg-white pt-16" id="global presence">
        <div className="container mx-auto px-16">
          <div className="text-center my-16">
            <h2 className="text-4xl font-medium uppercase">GLOBAL PRESENCE</h2>
            <p className="uppercase tracking-widest font-light">
              PROJECTS ACROSS THE GLOBE{" "}
            </p>
          </div>
          <div className="flex justify-center items-center overflow-hidden">
            <Image
              src="/globe.svg"
              alt="Company History"
              width={1195}
              height={694}
              className="w-[90%] h-full object-contain"
            />
          </div>
        </div>
      </section>
      <ChatComponent />
      <Footer />
    </main>
  );
}
