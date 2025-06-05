import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const sections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', to: '/#features' },
        { label: 'Pricing', to: '/#pricing' },
        { label: 'Learn ISL', to: '/learn' },
        { label: 'Community', to: '/community' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', to: '/#about' },
        { label: 'Impact', to: '/#impact' },
        { label: 'Careers', to: '/careers' },
        { label: 'Contact', to: '/support' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Blog', to: '/blog' },
        { label: 'Help Center', to: '/support' },
        { label: 'Accessibility', to: '/accessibility' },
      ],
    },
    {
        title: 'Legal',
        links: [
            { label: 'Privacy Policy', to: '/privacy' },
            { label: 'Terms of Service', to: '/terms' },
        ],
    }
  ];

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, to: 'https://twitter.com/ishara' },
    { icon: <Github className="h-5 w-5" />, to: 'https://github.com/ishara' },
    { icon: <Linkedin className="h-5 w-5" />, to: 'https://linkedin.com/company/ishara' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1 mb-8 md:mb-0">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img src="/lk5GFyFTTvqYupHbQQDAQQ-removebg-preview.png" alt="Ishara Logo" className="w-12 h-12" />
              <span className="font-extrabold text-2xl tracking-tight">ISHARA</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Breaking barriers with technology.
            </p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold tracking-wider uppercase mb-4 text-sm text-gray-300">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-gray-400 hover:text-white transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 sm:mb-0">
            &copy; {currentYear} ISHARA. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.to} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors duration-300">
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
