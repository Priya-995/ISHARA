
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-ishara-gradient rounded-lg flex items-center justify-center text-white font-bold">
                <span className="text-sm">इ</span>
              </div>
              <span className="font-bold text-xl">Ishara</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Breaking barriers with Indian Sign Language translation. Making every conversation accessible and inclusive for the deaf and hard-of-hearing community.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Built with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>to make communication inclusive for all</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/translator" className="hover:text-white transition-colors">Translator</Link></li>
              <li><Link to="/learn" className="hover:text-white transition-colors">Learn ISL</Link></li>
              <li><Link to="/community" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/support" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>accessibility@ishara.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>+91 98765 43210 (ISL Interpreter Available)</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Delhi, India</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Ishara. All rights reserved. Committed to digital accessibility and inclusion.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
