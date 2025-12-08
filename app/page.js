"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  GlobeIcon,
  Lock,
  MessageCircle,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
  Star,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Footer from "./Footer/Footer";

const AnimateIfVisible = ({ children, className, delay = 0 }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const features = [
  {
    name: "Instant Summaries",
    desc: "Get concise summaries of entire documents or specific sections in seconds.",
    icon: GlobeIcon,
  },
  {
    name: "Smart Question Answering",
    desc: "Ask any question from your PDF and get fast, accurate answers.",
    icon: ZapIcon,
  },
  {
    name: "Secure & Private Processing",
    desc: "Your documents are encrypted and protected at all times.",
    icon: Lock,
  },
  {
    name: "Chat Naturally",
    desc: "Ask questions in simple language and get human-like responses.",
    icon: MessageCircle,
  },
  {
    name: "Lightning Fast Responses",
    desc: "Real-time AI answers that save you hours of manual reading.",
    icon: ServerCogIcon,
  },
  {
    name: "Multi-Device Access",
    desc: "Use LucidDocs seamlessly on mobile, tablet, and desktop.",
    icon: MonitorSmartphoneIcon,
  },
];

const reviews = [
  {
    name: "Aisha",
    role: "Research Analyst",
    review:
      "LucidDocs saved me hours — the summaries and answers are unbelievably accurate.",
  },
  {
    name: "Rohit Sharma",
    role: "Product Manager",
    review:
      "Perfect for reviewing long documents quickly. My team uses it daily!",
  },
  {
    name: "Priya Mehta",
    role: "Student",
    review: "A must-have study tool. It feels like chatting with a tutor.",
  },
];

const faqs = [
  {
    q: "Is my data secure?",
    a: "Yes. All PDFs are encrypted and never shared with third parties.",
  },
  {
    q: "Can I use LucidDocs for scanned PDFs?",
    a: "Yes! OCR technology extracts text from scanned PDFs.",
  },
  {
    q: "Do I need an account to try it?",
    a: "You can try the demo without an account. Sign up for full access.",
  },
  {
    q: "Which file formats are supported?",
    a: "Currently PDF, with DOCX and TXT coming soon.",
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="relative flex-1 bg-gradient-to-bl from-white to-indigo-800 min-h-screen">
        <div className="relative bg-white py-24 drop-shadow-xl overflow-hidden">
          {/* Background Lines */}
          <div className="absolute inset-x-0 top-0 h-full opacity-100 pointer-events-none">
            <svg
              className="w-full h-full text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <defs>
                <pattern
                  id="gridPattern"
                  x="0"
                  y="0"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#gridPattern)" />
            </svg>
          </div>

          {/* HERO SECTION */}
          <AnimateIfVisible
            className="relative flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-6"
            delay={0.1}
          >
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
              Discover More, Faster with{" "}
              <span className="text-indigo-600">AI-Driven PDF Chat</span>
            </h1>

            <p className="mt-4 text-lg text-gray-500 max-w-2xl">
              Upload any document and get instant summaries, answers, and
              insights — powered by AI.
            </p>

            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
              <Button className="mt-8 bg-indigo-500 hover:bg-indigo-600">
                Get Started
              </Button>
            </SignUpButton>

            <div className="mt-10 w-full max-w-3xl mx-auto">
              <Image
                alt="Hero"
                src="/p5.png"
                width={832}
                height={843}
                priority
                className="shadow-xl ring-1 ring-gray-900/10 rounded-md"
              />
            </div>
          </AnimateIfVisible>

          {/* FEATURES */}
          <AnimateIfVisible className="mx-auto mt-20 max-w-5xl px-6" delay={0.2}>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-gray-700">
              {features.map((f) => (
                <div key={f.name} className="relative px-8">
                  <dt className="inline font-semibold text-gray-700">
                    <f.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                    <span className="ml-6">{f.name}</span>
                  </dt>
                  <dd className="mt-2 text-gray-600">{f.desc}</dd>
                </div>
              ))}
            </dl>
          </AnimateIfVisible>

          {/* ⭐ REVIEWS SECTION ⭐ */}
          <AnimateIfVisible className="py-20 mt-24 px-6" delay={0.3}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-12">
                What Our Users Say
              </h2>

              <div className="grid md:grid-cols-3 gap-8">
                {reviews.map((person, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/90 rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 * i }}
                  >
                    <div className="flex items-center gap-4 mb-4 justify-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-indigo-50">
                        {/* <Image
                          src={person.avatar}
                          alt={person.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        /> */}
                      </div>

                      <div className="text-left">
                        <h4 className="font-semibold text-gray-800">
                          {person.name}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {person.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-5 w-5 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>

                    <p className="text-gray-600 italic">“{person.review}”</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimateIfVisible>

          {/* FAQ SECTION */}
          <AnimateIfVisible className="py-16 px-6" delay={0.4}>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                Frequently Asked Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md cursor-pointer bg-white/90"
                    onClick={() => toggleFAQ(i)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">{item.q}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-indigo-600 transition-transform ${
                          activeIndex === i ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <motion.div
                      initial={false}
                      animate={{
                        height: activeIndex === i ? "auto" : 0,
                        opacity: activeIndex === i ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-3 text-gray-600 text-sm">{item.a}</p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </AnimateIfVisible>
        </div>
      </main>

      <Footer />
    </>
  );
}




