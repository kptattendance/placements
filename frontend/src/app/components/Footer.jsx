import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-300 border-t-4 border-blue-400">
      {/* Top Section */}
      <div className="container px-5 py-16 mx-auto flex flex-wrap md:flex-nowrap flex-col md:flex-row justify-between items-start gap-10">
        {/* Left Logo & Address */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/4">
          <img src="/logo.jpg" alt="KPT Logo" loading="lazy" className="h-24 w-auto mb-4 rounded-xl bg-white p-1.5" />
          <h2 className="text-lg font-semibold text-blue-100">
            Karnataka Govt. Polytechnic
          </h2>
          <p className="mt-2 text-sm text-gray-400 leading-6 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            Kadri Hills, Mangalore, Karnataka - 575004
          </p>
          <p className="mt-1 text-sm text-gray-400 flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            kptmng@gmail.com, kptplacements@gmail.com
          </p>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/4 px-4">
          <h2 className="font-semibold text-blue-400 tracking-widest text-sm mb-3">
            QUICK LINKS
          </h2>
          <nav className="flex flex-col space-y-2">
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/112/milestones/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              KPT Website
            </a>
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/10/campus-map/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Our Campus
            </a>
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/50/fee-structure/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Admissions
            </a>
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/18/contact/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Contact Us
            </a>
          </nav>
        </div>

        {/* Resources */}
        <div className="w-full md:w-1/4 px-4">
          <h2 className="font-semibold text-blue-400 tracking-widest text-sm mb-3">
            RESOURCES
          </h2>
          <nav className="flex flex-col space-y-2">
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/44/recently-visited-companies/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Placements
            </a>
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/57/list-of-principal%27s-/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Principal
            </a>
            <a
              href="https://kptalumni.org/"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Alumni
            </a>
            <a
              href="https://gpt.karnataka.gov.in/kptmangalore/public/115/events-/en"
              className="text-gray-600 hover:text-blue-400 transition-colors"
            >
              Events
            </a>
          </nav>
        </div>

        {/* Contact Details & Second Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-1/4">
          <img
            src="/logo2.png"
            loading="lazy"
            alt="KPT 75 Logo"
            className="h-24 w-auto mb-4 rounded-xl bg-white p-1.5"
          />
          <h2 className="text-lg font-semibold text-blue-100">
            Contact Details
          </h2>
          <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-400" />
            (0824) - 3516910, 3542476, 2211636, 3515889, 77604 21790
          </p>

          {/* Social Links */}
          <div className="flex gap-3 mt-4">
            <a
              href="#"
              className="p-2 bg-white/10 text-blue-100 rounded-full hover:bg-blue-400 hover:text-blue-900 transition"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 text-blue-100 rounded-full hover:bg-blue-400 hover:text-blue-900 transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 text-blue-100 rounded-full hover:bg-blue-400 hover:text-blue-900 transition"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="p-2 bg-white/10 text-blue-100 rounded-full hover:bg-blue-400 hover:text-blue-900 transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/30">
        <div className="container mx-auto py-4 px-5 flex flex-wrap flex-col sm:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Karnataka Govt. Polytechnic — All
            Rights Reserved
          </p>
          <span className="inline-flex mt-2 sm:mt-0 text-gray-400 text-sm">
            Maintained by{" "}
            <span className="text-blue-400 font-medium ml-1">
              KPT CSE Final Year Students
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
