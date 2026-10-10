"use client";

import {
  Briefcase,
  Users,
  Lightbulb,
  GraduationCap,
  Target,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-800">
      {/* HERO SECTION */}
      <section className="text-center py-16 bg-blue-800 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          About Training & Placement Cell
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Empowering students to become innovators, leaders, and job creators.
        </p>
      </section>

      {/* ABOUT CELL */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">
          About the Cell
        </h2>
        <p className="leading-relaxed mb-4 sm:text-justify">
          The <strong>Training and Placement Cell (T&P Cell)</strong> of{" "}
          <strong>Karnataka Government Polytechnic, Mangalore</strong> serves as
          a bridge between academic learning and professional application. It
          aims to empower diploma students with technical competence, industry
          awareness, and personal excellence.
        </p>
        <p className="leading-relaxed mb-4 sm:text-justify">
          The Cell organizes <strong>skill development programs</strong>,
          workshops, internships, and industrial visits that enhance students’
          confidence and employability. Our ultimate goal is to nurture{" "}
          <strong>job creators rather than job seekers</strong>, motivating
          students to explore entrepreneurship and innovation.
        </p>
        <p className="leading-relaxed sm:text-justify">
          We envision a future where every student is equipped not only to be
          employed but to create opportunities and lead with purpose in the
          ever-evolving industrial landscape.
        </p>
      </section>

      {/* VISION & MISSION */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {/* Vision */}
          <div className="p-8 bg-blue-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <Lightbulb className="text-blue-700 w-7 h-7" />
              <h3 className="text-2xl font-semibold text-blue-800">Vision</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              To nurture competent, confident, and industry-ready diploma
              professionals who become job creators rather than job seekers,
              empowering them to choose their own career path and contribute
              meaningfully to society and the nation’s technological growth.
            </p>
          </div>

          {/* Mission */}
          <div className="p-8 bg-blue-50 rounded-2xl shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <Target className="text-blue-700 w-7 h-7" />
              <h3 className="text-2xl font-semibold text-blue-800">Mission</h3>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>
                To develop students’ technical, entrepreneurial, and
                interpersonal skills through structured training and mentorship.
              </li>
              <li>
                To collaborate with industries and startups for
                innovation-driven learning.
              </li>
              <li>
                To encourage students to take charge of their career journey and
                select paths aligned with their passion.
              </li>
              <li>
                To promote entrepreneurship and startup culture among students.
              </li>
              <li>
                To ensure holistic development for professional and ethical
                growth.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* TPO MESSAGE */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl font-semibold text-blue-800 mb-6">
          Message from the Training & Placement Officer
        </h2>
        <blockquote className="italic text-lg leading-relaxed text-gray-700 bg-blue-50 p-8 rounded-2xl shadow-sm">
          “At Karnataka Government Polytechnic, Mangalore, our vision is not
          merely to prepare students for jobs — but to prepare them for life.”
          <br />
          <br />
          The Training and Placement Cell of KPT Mangalore is dedicated to
          empowering students to be{" "}
          <strong>job givers rather than job seekers</strong>. We aim to build a
          generation of diploma engineers who think critically, act
          independently, and lead confidently. Through sustained training,
          industry partnerships, and innovation-led learning, we strive to
          bridge the gap between academia and industry.
          <br />
          <br />
          <span className="font-semibold text-blue-800">
            “We believe every student carries within them the potential to
            create — not just seek — opportunities.”
          </span>
          <br />
          <br />
          <span className="font-bold">— Training & Placement Officer</span>
          <br />
          Karnataka Government Polytechnic, Mangalore
        </blockquote>
      </section>

      {/* ORGANIZATION STRUCTURE */}
      <section className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold text-blue-800 mb-8">
            Organizational Structure
          </h2>
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-blue-100 rounded-xl w-64 shadow-sm">
              <h4 className="font-bold text-blue-800">Principal</h4>
            </div>
            <div className="p-4 bg-blue-200 rounded-xl w-64 shadow-sm">
              <h4 className="font-bold text-blue-800">
                Training & Placement Officer
              </h4>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="p-4 bg-blue-50 rounded-xl w-60 shadow-sm">
                Department Coordinators
              </div>
              <div className="p-4 bg-blue-50 rounded-xl w-60 shadow-sm">
                Student Placement Representatives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-semibold text-blue-800 mb-8 text-center">
          Objectives of the Training & Placement Cell
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Briefcase,
              text: "Enhance employability skills through regular training programs.",
            },
            {
              icon: Users,
              text: "Foster collaboration between academia and industry.",
            },
            {
              icon: GraduationCap,
              text: "Facilitate internships, industrial visits, and placement drives.",
            },
            {
              icon: Lightbulb,
              text: "Encourage innovation and entrepreneurship among students.",
            },
            {
              icon: Target,
              text: "Guide students toward career paths aligned with their interests.",
            },
          ].map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="p-6 bg-blue-50 rounded-2xl shadow-sm flex items-start gap-3 hover:shadow-md transition"
            >
              <Icon className="text-blue-700 w-6 h-6 mt-1" />
              <p className="text-gray-700 leading-snug">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
