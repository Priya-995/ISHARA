import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { 
  Play, 
  Users, 
  Camera, 
  MessageSquare, 
  BookOpen, 
  Globe, 
  Heart,
  TrendingUp,
  Award,
  CheckCircle,
  ArrowRight,
  HandHeart,
  Zap,
  Shield
} from 'lucide-react';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
  hover: { scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)", transition: { duration: 0.3 } }
};

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
            >
              <motion.h1 
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                variants={sectionVariants}
              >
                Breaking Barriers with{' '}
                <span className="bg-ishara-gradient bg-clip-text text-transparent">
                  Sign Language Translation
                </span>
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8 max-w-2xl"
                variants={sectionVariants}
              >
                Ishara empowers the deaf and hard-of-hearing community with real-time ISL translation, 
                making every conversation accessible and inclusive.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={sectionVariants}
              >
                <Link to="/signup">
                  <Button className="bg-ishara-gradient hover:opacity-90 text-white px-8 py-3 text-lg">
                    Try Ishara Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" className="px-8 py-3 text-lg border-ishara-blue text-ishara-blue hover:bg-ishara-blue hover:text-white">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>
              <motion.p 
                className="text-sm text-gray-500 mt-4"
                variants={sectionVariants}
              >
                <Users className="inline h-4 w-4 mr-1" />
                Join 10,000+ users breaking communication barriers
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }}
            >
              <div className="bg-ishara-gradient rounded-2xl p-8 text-white animate-float">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <HandHeart className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Real-time ISL</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Text & Speech</p>
                  </div>
                </div>
                <div className="text-center">
                  <Camera className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-semibold">Translation in Progress...</p>
                  <div className="mt-4 bg-white/10 rounded-lg p-3">
                    <p className="text-sm">"नमस्ते, आप कैसे हैं?" → ISL</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              More Than Just Translation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive features designed for the deaf and hard-of-hearing community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="p-8 h-full hover:shadow-xl transition-shadow border-none shadow-lg">
                <CardContent className="p-0 text-center">
                  <div className="bg-ishara-gradient rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real-Time Translation</h3>
                  <p className="text-gray-600">Instantly convert ISL gestures to text and speech, and vice-versa.</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="p-8 h-full hover:shadow-xl transition-shadow border-none shadow-lg">
                <CardContent className="p-0 text-center">
                  <div className="bg-ishara-gradient rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Multi-Platform Support</h3>
                  <p className="text-gray-600">Use Ishara on your phone, tablet, or desktop computer.</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="p-8 h-full hover:shadow-xl transition-shadow border-none shadow-lg">
                <CardContent className="p-0 text-center">
                  <div className="bg-ishara-gradient rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Learning Resources</h3>
                  <p className="text-gray-600">Access a library of ISL signs, phrases, and tutorials.</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Use Cases Section */}
      <motion.section 
        id="use-cases" 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Communication for Every Scenario
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ishara is designed for various real-world situations, breaking down barriers everywhere.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="p-6 text-center h-full">
                <Users className="h-10 w-10 text-ishara-blue mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Daily Conversations</h3>
                <p className="text-sm text-gray-600">Connect with family, friends, and colleagues effortlessly.</p>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="p-6 text-center h-full">
                <BookOpen className="h-10 w-10 text-ishara-teal mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Education</h3>
                <p className="text-sm text-gray-600">Participate in classroom discussions and lectures seamlessly.</p>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="p-6 text-center h-full">
                <Heart className="h-10 w-10 text-ishara-orange mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Healthcare</h3>
                <p className="text-sm text-gray-600">Communicate effectively with doctors and healthcare professionals.</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Impact Section */}
      <motion.section 
        id="impact" 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The Communication Gap is Real
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Understanding the challenges faced by the deaf and hard-of-hearing community in India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center p-8 border-none shadow-lg h-full">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-ishara-blue mb-2">18M+</div>
                  <p className="text-gray-600 mb-2">Deaf & Hard-of-Hearing Indians</p>
                  <p className="text-sm text-gray-500">Who rely on ISL as their primary language</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center p-8 border-none shadow-lg h-full">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-ishara-orange mb-2">250+</div>
                  <p className="text-gray-600 mb-2">Certified ISL Interpreters</p>
                  <p className="text-sm text-gray-500">Nationwide shortage creating barriers</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="text-center p-8 border-none shadow-lg h-full">
                <CardContent className="p-0">
                  <div className="text-4xl font-bold text-ishara-teal mb-2">85%</div>
                  <p className="text-gray-600 mb-2">Face Employment Barriers</p>
                  <p className="text-sm text-gray-500">Due to communication challenges</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section 
        id="pricing" 
        className="py-16 bg-gray-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, affordable pricing for individuals and organizations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            <motion.div variants={cardVariants} whileHover="hover" className="h-full">
              <Card className="p-8 text-center h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Basic</h3>
                <p className="text-4xl font-bold mb-4">Free</p>
                <p className="text-gray-600 mb-6 flex-grow">For basic personal use</p>
                <Button>Get Started</Button>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover" className="h-full">
              <Card className="p-8 text-center border-2 border-ishara-blue h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Pro</h3>
                <p className="text-4xl font-bold mb-4">₹499<span className="text-lg">/mo</span></p>
                <p className="text-gray-600 mb-6 flex-grow">For professionals and power users</p>
                <Button className="bg-ishara-gradient text-white">Choose Pro</Button>
              </Card>
            </motion.div>
            <motion.div variants={cardVariants} whileHover="hover" className="h-full">
              <Card className="p-8 text-center h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <p className="text-4xl font-bold mb-4">Custom</p>
                <p className="text-gray-600 mb-6 flex-grow">For teams and organizations</p>
                <Button>Contact Us</Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section 
        id="about" 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Why Indian Sign Language Matters
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Indian Sign Language (ISL) is the primary language for over 18 million Indians, 
                  representing a rich linguistic tradition with its own grammar, syntax, and cultural significance.
                </p>
                <p>
                  Unlike spoken languages, ISL has unique regional variations across states, 
                  making it crucial to preserve and promote this diverse form of communication 
                  that connects communities nationwide.
                </p>
              </div>
              <div className="mt-8">
                <Link to="/about">
                  <Button variant="outline" className="border-ishara-blue text-ishara-blue hover:bg-ishara-blue hover:text-white">
                    Learn More About Ishara
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 border-l-4 border-ishara-blue">
                <Globe className="h-8 w-8 text-ishara-blue mb-3" />
                <h3 className="font-semibold mb-2">Cultural Heritage</h3>
                <p className="text-sm text-gray-600">Rich linguistic tradition across Indian states</p>
              </Card>
              <Card className="p-6 border-l-4 border-ishara-teal">
                <BookOpen className="h-8 w-8 text-ishara-teal mb-3" />
                <h3 className="font-semibold mb-2">Educational Impact</h3>
                <p className="text-sm text-gray-600">Breaking learning barriers in schools</p>
              </Card>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <section className="py-16 bg-ishara-gradient">
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Bridge the Gap?
          </h2>
          <p className="text-xl mb-8">
            Join Ishara today and be a part of a more inclusive world.
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-ishara-blue hover:bg-gray-200">
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
