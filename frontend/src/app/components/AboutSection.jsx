"use client";
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left Side — Image */}
        <div className="relative w-full h-80 md:h-[400px] rounded-xl overflow-hidden shadow-lg">
          <Image
            src="/1.jpg" // 🖼️ replace with your real image
            alt="KPT Placement Cell"
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Right Side — Text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
            About the Training & Placement Cell
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            The Training and Placement Cell at Karnataka Government Polytechnic,
            Mangalore is dedicated to enhancing the employability skills of
            students by bridging the gap between academia and industry. Through
            structured training programs, personality development workshops, and
            close industry collaborations, we ensure our students are equipped
            with the right skills and attitude to excel in their careers.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our mission is to create a robust platform for students to connect
            with leading recruiters, gain hands-on industrial exposure, and
            build a successful professional future.
          </p>
          <Link
            href="/about"
            className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-800 transition-all"
          >
            Read More → About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
