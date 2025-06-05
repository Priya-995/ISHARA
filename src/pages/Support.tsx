
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { 
  HelpCircle, 
  Book, 
  Video, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search, 
  CheckCircle,
  FileText,
  Headphones,
  PlayCircle,
  Link,
  Clock
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll respond within 24 hours.",
    });
    setContactForm({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const faqs = [
    {
      question: "How accurate is Ishara's ISL translation?",
      answer: "Ishara's translation accuracy is over 95% for most common signs and phrases. The accuracy varies based on factors like lighting conditions, camera quality, and regional sign variations. Our AI model continuously improves as it learns from more interactions."
    },
    {
      question: "Does Ishara work offline?",
      answer: "Yes, Ishara offers limited offline functionality. Basic translations and previously downloaded learning materials can be accessed without an internet connection. However, community features and advanced translation capabilities require internet access."
    },
    {
      question: "How does Ishara handle different regional ISL variations?",
      answer: "Ishara recognizes and supports regional ISL variations from different parts of India. Users can select their preferred regional dialect in the settings. Our database includes variations from major regions, and we're constantly expanding our coverage with community contributions."
    },
    {
      question: "Is my data private when using Ishara?",
      answer: "Yes, privacy is a priority at Ishara. By default, video processing happens on your device whenever possible, and we don't store your video feeds. Your translation history is saved locally unless you opt to share it. You can delete your data at any time through the privacy settings."
    },
    {
      question: "Can Ishara translate group conversations?",
      answer: "Yes, Ishara supports group translation in Conversation Mode. This feature allows multiple participants to communicate in real-time, with translations visible to everyone in the session. This is useful for meetings, classrooms, and social gatherings."
    },
    {
      question: "How can I improve the accuracy of translations?",
      answer: "For best results: 1) Ensure good lighting conditions, 2) Position your camera to capture your signing space completely, 3) Sign at a moderate pace, 4) Select the correct regional dialect in settings, and 5) Provide feedback on incorrect translations to help our system improve."
    }
  ];

  const resources = [
    {
      title: "Getting Started with Ishara",
      description: "Learn the basics of using the Ishara platform",
      type: "guide",
      timeToRead: "5 min",
      popular: true
    },
    {
      title: "Translator User Guide",
      description: "Comprehensive guide to the translation features",
      type: "guide",
      timeToRead: "10 min",
      popular: false
    },
    {
      title: "ISL Learning Tools Tutorial",
      description: "How to get the most out of the learning modules",
      type: "video",
      duration: "6:42",
      popular: true
    },
    {
      title: "Community Guidelines",
      description: "Rules and best practices for the Ishara community",
      type: "document",
      timeToRead: "7 min",
      popular: false
    },
    {
      title: "Accessibility Settings",
      description: "Customize Ishara for your specific needs",
      type: "video",
      duration: "4:18",
      popular: true
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions to frequent technical problems",
      type: "guide",
      timeToRead: "12 min",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Help & Support
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get the assistance you need to make the most of Ishara's features and resolve any issues.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search for help articles, tutorials, and FAQs..."
            className="pl-10 py-6 text-lg shadow-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-blue-100">
                  <HelpCircle className="h-6 w-6 text-ishara-blue" />
                </div>
                <div>
                  <h3 className="font-semibold">FAQs</h3>
                  <p className="text-sm text-gray-600">Common questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-teal-100">
                  <Book className="h-6 w-6 text-ishara-teal" />
                </div>
                <div>
                  <h3 className="font-semibold">User Guides</h3>
                  <p className="text-sm text-gray-600">Step-by-step help</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-orange-100">
                  <Video className="h-6 w-6 text-ishara-orange" />
                </div>
                <div>
                  <h3 className="font-semibold">Video Tutorials</h3>
                  <p className="text-sm text-gray-600">Visual instructions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-purple-100">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Community Help</h3>
                  <p className="text-sm text-gray-600">Ask other users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="resources" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Help Resources</TabsTrigger>
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          {/* Help Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Popular Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource, index) => (
                    <Card key={index} className="border hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-2 mb-2">
                          {resource.type === 'guide' && (
                            <Book className="h-5 w-5 text-ishara-blue" />
                          )}
                          {resource.type === 'video' && (
                            <PlayCircle className="h-5 w-5 text-ishara-orange" />
                          )}
                          {resource.type === 'document' && (
                            <FileText className="h-5 w-5 text-ishara-teal" />
                          )}
                          <div>
                            <h3 className="font-medium text-gray-900">{resource.title}</h3>
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-xs text-gray-500 flex items-center">
                            {resource.type === 'video' ? (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                {resource.duration}
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                {resource.timeToRead} read
                              </>
                            )}
                          </div>
                          {resource.popular && (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    View All Resources
                    <Link className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Video className="h-5 w-5 mr-2 text-ishara-orange" />
                    Getting Started Tutorial
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <PlayCircle className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">
                    Watch this short video to get a complete overview of the Ishara platform and learn how to start using it effectively.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Headphones className="h-5 w-5 mr-2 text-ishara-blue" />
                    Accessibility Support
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    We're committed to making Ishara accessible to everyone. Find resources for using Ishara with assistive technologies.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      Screen Reader Guide
                    </Button>
                    <Button variant="outline" className="justify-start text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      High Contrast Mode
                    </Button>
                    <Button variant="outline" className="justify-start text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      Keyboard Navigation
                    </Button>
                    <Button variant="outline" className="justify-start text-sm">
                      <Book className="h-4 w-4 mr-2" />
                      Text Resizing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="text-lg font-semibold text-ishara-blue mb-2">Didn't find what you're looking for?</h3>
                  <p className="text-gray-600 mb-4">Our support team is ready to help with any other questions you might have.</p>
                  <Button className="bg-ishara-gradient hover:opacity-90 text-white">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg lg:col-span-2">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitContact} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Your Name
                        </label>
                        <Input 
                          id="name" 
                          type="text" 
                          placeholder="Enter your name"
                          value={contactForm.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="your.email@example.com"
                          value={contactForm.email}
                          onChange={(e) => handleFormChange('email', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <Input 
                        id="subject" 
                        type="text" 
                        placeholder="What is your inquiry about?"
                        value={contactForm.subject}
                        onChange={(e) => handleFormChange('subject', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <Textarea 
                        id="message" 
                        placeholder="Please provide as much detail as possible"
                        className="min-h-32"
                        value={contactForm.message}
                        onChange={(e) => handleFormChange('message', e.target.value)}
                        required
                      />
                    </div>

                    <Button type="submit" className="bg-ishara-gradient hover:opacity-90 text-white">
                      Submit Support Request
                    </Button>

                    <p className="text-sm text-gray-500">
                      Our team typically responds within 24 hours during business days.
                    </p>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Phone className="h-5 w-5 mr-2 text-ishara-blue" />
                      Direct Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Support Hours</h3>
                      <p className="text-sm text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM IST
                      </p>
                      <p className="text-sm text-gray-600">
                        Saturday: 10:00 AM - 2:00 PM IST
                      </p>
                      <p className="text-sm text-gray-600">
                        Sunday: Closed
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold">Email Support</h3>
                      <div className="flex items-center text-sm text-ishara-blue">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href="mailto:support@ishara.com">support@ishara.com</a>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold">Phone Support</h3>
                      <div className="flex items-center text-sm text-ishara-blue">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href="tel:+919876543210">+91 98765 43210</a>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        (ISL interpreter available on request)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gray-50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">Ready to Get Help from the Community?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Connect with other Ishara users and get help from the community.
                    </p>
                    <Button variant="outline" className="w-full">
                      Visit Community Forum
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-semibold">Dedicated Support for Deaf Users</h3>
                        <p className="text-sm text-gray-600">
                          We offer ISL video support for deaf and hard-of-hearing users.
                          <Button variant="link" className="p-0 h-auto block">
                            Request ISL Support
                          </Button>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
