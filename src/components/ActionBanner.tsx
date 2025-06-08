import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { sectionVariants } from '@/lib/animations';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface ActionBannerProps {
  className?: string;
  title: string;
  description: string;
  buttonText: string;
  linkTo: string;
  Icon?: LucideIcon;
  gradient?: string;
  useContainer?: boolean;
}

const ActionBanner = ({ className, title, description, buttonText, linkTo, Icon, gradient = 'bg-ishara-gradient', useContainer = true }: ActionBannerProps) => {
  const bannerContent = (
    <div className={cn("rounded-2xl p-8 text-center text-white h-full flex flex-col justify-center items-center", gradient)}>
      {Icon && (
        <div className="flex items-center justify-center mx-auto mb-4 bg-white/20 rounded-full p-3 w-16 h-16">
          <Icon className="h-8 w-8 text-white" />
        </div>
      )}
      <h2 className="text-2xl font-bold mb-2">
        {title}
      </h2>
      <p className="text-base mb-4 max-w-md mx-auto">
        {description}
      </p>
      <Link to={linkTo}>
        <Button
          variant="outline"
          className="bg-white text-ishara-blue hover:bg-gray-100 px-6 py-2 text-base"
        >
          {buttonText}
        </Button>
      </Link>
    </div>
  );
  
  return (
    <motion.section
      className={cn("bg-transparent", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      {useContainer ? <div className="container mx-auto px-4">{bannerContent}</div> : bannerContent}
    </motion.section>
  );
};

export default ActionBanner; 