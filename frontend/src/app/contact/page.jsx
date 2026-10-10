"use client";

import { Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  return (
    <section className="text-gray-700 body-font relative">
      <div className="container px-5 py-24 mx-auto flex sm:flex-nowrap flex-wrap">
        {/* LEFT SIDE: MAP + CONTACT INFO */}
        <div className="lg:w-2/3 md:w-1/2 bg-gray-300 rounded-2xl overflow-hidden sm:mr-10 p-10 flex items-end justify-start relative shadow-lg">
          <iframe
            width="100%"
            height="100%"
            className="absolute inset-0"
            frameBorder="0"
            title="map"
            marginHeight="0"
            marginWidth="0"
            scrolling="no"
            src="https://maps.google.com/maps?q=Karnataka%20Government%20Polytechnic%20Mangalore&t=&z=15&ie=UTF8&iwloc=&output=embed"
            style={{ filter: "grayscale(1) contrast(1.2) opacity(0.5)" }}
          ></iframe>

          <div className="bg-white relative flex flex-wrap py-6 rounded-xl shadow-md w-full md:w-auto">
            {/* Address Section */}
            <div className="lg:w-1/2 px-6 mb-4 md:mb-0">
              <h2 className="title-font font-semibold text-blue-800 tracking-widest text-sm">
                ADDRESS
              </h2>
              <p className="mt-2 text-gray-700 leading-relaxed">
                Training & Placement Cell, <br />
                Karnataka Government Polytechnic, <br />
                Kadri Hills, Mangalore – 575003, Karnataka
              </p>
            </div>

            {/* Email & Phone Section */}
            <div className="lg:w-1/2 px-6">
              <h2 className="title-font font-semibold text-blue-800 tracking-widest text-sm">
                EMAIL
              </h2>
              <Link
                href="mailto:kptplacements@gmail.com"
                className="text-blue-700 leading-relaxed hover:underline block"
              >
                kptplacements@gmail.com
              </Link>

              <h2 className="title-font font-semibold text-blue-800 tracking-widest text-sm mt-4">
                PHONE
              </h2>
              <p className="leading-relaxed text-gray-700">
                (0824) - 3516910 <br />
                77604 21790
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FEEDBACK FORM */}
        <div className="lg:w-1/3 md:w-1/2 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-blue-800 text-2xl mb-3 font-semibold title-font">
            Feedback / Enquiry
          </h2>
          <p className="leading-relaxed mb-6 text-gray-600">
            Have a query or suggestion? Feel free to reach out — we’d love to
            hear from you.
          </p>

          <form
            onSubmit={(e) => {
              // Opens the visitor's email app with the message filled in
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const subject = `Enquiry from ${form.get("name")}`;
              const body = `${form.get("message")}

From: ${form.get("name")} (${form.get("email")})`;
              window.location.href = `mailto:kptplacements@gmail.com?subject=${encodeURIComponent(
                subject
              )}&body=${encodeURIComponent(body)}`;
            }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="name"
                className="leading-7 text-sm text-gray-700 font-medium"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-white rounded-lg border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-700 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white rounded-lg border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="leading-7 text-sm text-gray-700 font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="w-full bg-white rounded-lg border border-gray-300 focus:border-blue-700 focus:ring-2 focus:ring-blue-200 h-32 text-base outline-none text-gray-700 py-2 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
              ></textarea>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 border-0 py-2 px-6 focus:outline-none hover:bg-blue-800 rounded-lg text-lg font-semibold transition"
            >
              Send Message
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-3 text-center">
            We’ll respond to your message during office hours.
          </p>
        </div>
      </div>
    </section>
  );
}
