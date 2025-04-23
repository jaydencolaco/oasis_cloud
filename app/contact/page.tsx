"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Phone } from "lucide-react";
import Image from "next/image";

export default function ContactUs() {
  // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const formData = new FormData(event.currentTarget);

  //   try {
  //     const response = await fetch(
  //       "https://formspree.io/f/your-formspree-endpoint",
  //       {
  //         method: "POST",
  //         body: formData,
  //         headers: {
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     if (response.ok) {
  //       setSubmitted(true);
  //     } else {
  //       console.error("Form submission failed");
  //     }
  //   } catch (error) {
  //     console.error("There was an error submitting the form", error);
  //   }
  // };

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("/api/sendContactMail", {
        name: name,
        email: email,
        phone: phone,
        message: message,
      });
      toast("Thank you for contacting Oasis Luminaires", {
        description: "We will revert back to you soon",
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
      console.log("Mail sent successfully");
    } catch (error) {
      console.error("Failed to send request", error);
      toast("Error sending message", {
        description: "Please check your connectivity",
        action: {
          label: "Done",
          onClick: () => console.log("Done"),
        },
      });
    } finally {
      setIsLoading(false);
    }
    e.target.reset();
  };

  return (
    <main className="min-h-screen">
      <Toaster />
      <Navbar />
      <div className="container mx-auto px-4 pt-10 mb-16">
        <div className="mb-12 pt-10">
          <div className="text-center my-5">
            <h2 className="text-4xl font-medium uppercase">Contact Us</h2>
            <p className="uppercase tracking-widest font-light">
              Get in touch with us {""}
            </p>
          </div>
        </div>
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-3 bg-white border border-gray-200 rounded-lg shadow-lg p-6"
              >
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e: any) => {
                      setName(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e: any) => {
                      setEmail(e.target.value);
                    }}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    type="tel"
                    value={phone}
                    required
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const inputValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                      if (inputValue.length <= 10) {
                        setPhone(inputValue); // Set only if it's within 10 digits
                      }
                    }}
                    id="phone"
                    name="phone"
                    maxLength={10} // Ensures max input length at the HTML level
                    pattern="\d{10}" // Ensures only 10-digit numbers on form submission
                    title="Enter a valid 10-digit phone number"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e: any) => {
                      setMessage(e.target.value);
                    }}
                    name="message"
                    required
                    rows={6}
                  />
                </div>
                {isLoading ? (
                  <Button
                    id="disabled-loader"
                    disabled
                    variant="oasis"
                    type="submit"
                  >
                    <Loader2 className="animate-spin" />
                    Send Message
                  </Button>
                ) : (
                  <Button id="send" variant="oasis" type="submit">
                    Send Message
                  </Button>
                )}
              </form>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="uppercase tracking-widest font-medium mb-2">
                  Our Addresses
                </h3>
                <p className="pt-3  font-light tracking-widest">
                  <strong>Headquarters:</strong>
                </p>
                {/* <br /> */}
                <p className=" text-gray-500">
                  Supernova Lighting Industries,
                  <br /> Plot No. 9/B, Government Industrial Estate,
                  <br /> Charkop, Kandivali (W),
                  <br /> Mumbai – 400067
                </p>
                <p className="pt-3  font-light tracking-widest">
                  <strong>Branch Office:</strong>
                </p>
                <p className="mb-2  text-gray-500">
                  Prachi International Lights,
                  <br /> Plot no 4 SNO 35 2,
                  <br /> Western Express Highway,
                  <br /> Sativali Vasai East,
                  <br /> Palghar – 401208
                </p>
                <p className="pt-3  font-light tracking-widest">
                  <strong>Contact Information:</strong>
                </p>
                <div className="space-y-1">
                  <div className="flex gap-1 items-center">
                    <Image
                      src="Phone.svg"
                      alt="phone icon"
                      height={22}
                      width={22}
                    />
                    <div className="text-gray-500">+91 9029646535 </div>
                  </div>
                  <div className="flex gap-1">
                    <Image
                      src="Email.svg"
                      alt="email icon"
                      height={22}
                      width={22}
                    />
                    <p className="text-gray-500">sales@oasisluminaires.com</p>
                  </div>
                  <div className="flex gap-1">
                    <Image
                      src="Email.svg"
                      alt="email icon"
                      height={22}
                      width={22}
                    />
                    <p className="text-gray-500">sli.luminaires@gmail.com </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-8">
          <div className="aspect-w-16 aspect-h-9 mb-20">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3767.736233263891!2d72.8274034!3d19.2067196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b7823161eaf3%3A0x44d37da28e6cc079!2sSUPERNOVA%20LIGHTING%20INDUSTRIES!5e0!3m2!1sen!2sin!4v1735920631079!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
