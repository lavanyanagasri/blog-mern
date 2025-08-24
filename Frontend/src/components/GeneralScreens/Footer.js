import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side - Brand / About */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-white">Your Blog</h2>
          <p className="text-sm mt-2 max-w-xs">
            Sharing knowledge, insights, and stories to inspire developers and readers worldwide.
          </p>
        </div>

        {/* Middle - Links */}
        <div className="flex space-x-6 text-sm">
          <a href="/about" className="hover:text-white transition">About</a>
          <a href="/contact" className="hover:text-white transition">Contact</a>
          <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-white transition">Terms</a>
        </div>

        {/* Right Side - Socials */}
        <div className="flex space-x-4">
          <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaGithub size={20} />
          </a>
          <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaLinkedin size={20} />
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
            <FaTwitter size={20} />
          </a>
        </div>
      </div>

      {/* Bottom line */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Your Blog. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
