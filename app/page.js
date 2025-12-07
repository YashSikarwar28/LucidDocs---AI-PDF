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

// ❌ REMOVED: import Head from "next/head";

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
    desc: "Get concise summaries of entire documents or specific sections in seconds, perfect for research or reports.",
    icon: GlobeIcon,
  },
  {
    name: "Smart Question Answering",
    desc: "Quickly ask any question from your PDF, and get direct, accurate answers without sifting through lengthy documents.",
    icon: ZapIcon,
  },
  {
    name: "Secure & Private Processing",
    desc: "Your documents are handled securely with data encryption and no unintended data sharing.",
    icon: Lock,
  },
  {
    name: "Chat Naturally",
    desc: "Interact with your documents using plain language; our smart chat understands your questions and keeps the conversation flowing.",
    icon: MessageCircle,
  },
  {
    name: "Lightning Fast Responses",
    desc: "Enjoy seamless, real-time conversations with your PDFs, saving you valuable time with every chat.",
    icon: ServerCogIcon,
  },
  {
    name: "Multi-Device Access",
    desc: "Work seamlessly across desktop, tablet, or phone so you can chat with your PDFs anywhere.",
    icon: MonitorSmartphoneIcon,
  },
];

const faqs = [
  {
    q: "Is my data secure?",
    a: "Yes. All uploaded PDFs are encrypted, and LucidDocs never shares your data with third parties.",
  },
  {
    q: "Can I use LucidDocs for scanned PDFs?",
    a: "Absolutely! We use OCR technology to extract text from scanned PDFs for chat and summarization.",
  },
  {
    q: "Do I need an account to try it?",
    a: "You can test the demo without an account, but sign-up unlocks history, saved docs, and full AI access.",
  },
  {
    q: "Which file formats are supported?",
    a: "Currently, LucidDocs supports PDF files, with DOCX and TXT support coming soon.",
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // FAQ Schema (keep this)
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
      {/* ONLY JSON-LD script should remain — correct for App Router */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* MAIN CONTENT */}
      <main className="relative flex-1 bg-gradient-to-bl from-white to-indigo-800 min-h-screen">
        <div className="relative bg-white py-24 sm:py-30 drop-shadow-xl overflow-hidden">
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
            className="relative flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-6 lg:px-8"
            delay={0.1}
          >
            <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
              Discover More, Faster with{" "}
              <span className="text-indigo-600">AI-Driven PDF Chat</span>
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl">
              Meet <span className="font-bold text-indigo-600">LucidDocs</span>{" "}
              — Upload any document and ask questions directly. Get fast,
              accurate answers powered by cutting-edge AI.
            </p>

            <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
              <Button className="mt-8 bg-indigo-500 cursor-pointer hover:bg-indigo-600">
                Get Started
              </Button>
            </SignUpButton>

            <div className="mt-10 relative w-full max-w-3xl mx-auto">
              <Image
                alt="Hero illustration"
                src="/p5.png"
                width={832}
                height={843}
                priority
                className="shadow-xl ring-1 ring-gray-900/10 rounded-md"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
              />
            </div>
          </AnimateIfVisible>

          {/* FEATURES SECTION */}
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

          {/* REVIEWS SECTION */}
          <AnimateIfVisible
            className="relative py-20 mt-24 px-6 lg:px-8"
            delay={0.3}
          >
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-12">
                What Our Users Say
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[ /* reviews unchanged */ ].map((person, i) => (
                  <motion.div
                    key={i}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 * i }}
                  >
                    <div className="flex justify-center mb-3">
                      {[...Array(5)].map((_, idx) => (
                        <Star
                          key={idx}
                          className="h-5 w-5 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-4">
                      “{person.review}”
                    </p>
                    <h4 className="font-semibold text-gray-800">
                      {person.name}
                    </h4>
                    <span className="text-sm text-gray-500">{person.role}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </AnimateIfVisible>

          {/* FAQ SECTION */}
          <AnimateIfVisible className="relative py-16 px-6 lg:px-8" delay={0.4}>
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
                <span className="block sm:hidden">FAQs</span>
                <span className="hidden sm:block">
                  Frequently Asked Questions
                </span>
              </h2>

              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white/90 backdrop-blur-sm"
                    onClick={() => toggleFAQ(i)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">{item.q}</h3>
                      <ChevronDown
                        className={`h-5 w-5 text-indigo-600 transition-transform duration-300 ${
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
                      <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                        {item.a}
                      </p>
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



// "use client";

// import { SignUpButton } from "@clerk/nextjs";
// import { Button } from "@/components/ui/button";
// import {
//   GlobeIcon,
//   Lock,
//   MessageCircle,
//   MonitorSmartphoneIcon,
//   ServerCogIcon,
//   ZapIcon,
//   Star,
//   ChevronDown,
// } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// import { motion } from "framer-motion";
// import { useInView } from "react-intersection-observer";
// import Footer from "./Footer/Footer";


// const AnimateIfVisible = ({ children, className, delay = 0 }) => {
//   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
//   return (
//     <motion.div
//       ref={ref}
//       className={className}
//       initial={{ opacity: 0, y: 30 }}
//       animate={inView ? { opacity: 1, y: 0 } : {}}
//       transition={{ duration: 0.6, delay }}
//     >
//       {children}
//     </motion.div>
//   );
// };


// const features = [
//   {
//     name: "Instant Summaries",
//     desc: "Get concise summaries of entire documents or specific sections in seconds, perfect for research or reports.",
//     icon: GlobeIcon,
//   },
//   {
//     name: "Smart Question Answering",
//     desc: "Quickly ask any question from your PDF, and get direct, accurate answers without sifting through lengthy documents.",
//     icon: ZapIcon,
//   },
//   {
//     name: "Secure & Private Processing",
//     desc: "Your documents are handled securely with data encryption and no unintended data sharing.",
//     icon: Lock,
//   },
//   {
//     name: "Chat Naturally",
//     desc: "Interact with your documents using plain language; our smart chat understands your questions and keeps the conversation flowing.",
//     icon: MessageCircle,
//   },
//   {
//     name: "Lightning Fast Responses",
//     desc: "Enjoy seamless, real-time conversations with your PDFs, saving you valuable time with every chat.",
//     icon: ServerCogIcon,
//   },
//   {
//     name: "Multi-Device Access",
//     desc: "Work seamlessly across desktop, tablet, or phone so you can chat with your PDFs anywhere.",
//     icon: MonitorSmartphoneIcon,
//   },
// ];



// const faqs = [
//   {
//     q: "Is my data secure?",
//     a: "Yes. All uploaded PDFs are encrypted, and LucidDocs never shares your data with third parties.",
//   },
//   {
//     q: "Can I use LucidDocs for scanned PDFs?",
//     a: "Absolutely! We use OCR technology to extract text from scanned PDFs for chat and summarization.",
//   },
//   {
//     q: "Do I need an account to try it?",
//     a: "You can test the demo without an account, but sign-up unlocks history, saved docs, and full AI access.",
//   },
//   {
//     q: "Which file formats are supported?",
//     a: "Currently, LucidDocs supports PDF files, with DOCX and TXT support coming soon.",
//   },
// ];

// export default function Home() {
//   const [activeIndex, setActiveIndex] = useState(null);
//   const toggleFAQ = (index) => {
//     setActiveIndex(activeIndex === index ? null : index);
//   };


  
//   const faqSchema = {
//     "@context": "https://schema.org",
//     "@type": "FAQPage",
//     mainEntity: faqs.map((faq) => ({
//       "@type": "Question",
//       name: faq.q,
//       acceptedAnswer: {
//         "@type": "Answer",
//         text: faq.a,
//       },
//     })),
//   };

//   return (
//     <>
//       {/* Keep ONLY JSON-LD script — correct for Next.js App Router */}
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
//       />

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="relative flex-1 bg-gradient-to-bl from-white to-indigo-800 min-h-screen">
//         <div className="relative bg-white py-24 sm:py-30 drop-shadow-xl overflow-hidden">
//           <div className="absolute inset-x-0 top-0 h-full opacity-100 pointer-events-none">
//             <svg
//               className="w-full h-full text-indigo-600"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//             >
//               <defs>
//                 <pattern
//                   id="gridPattern"
//                   x="0"
//                   y="0"
//                   width="40"
//                   height="40"
//                   patternUnits="userSpaceOnUse"
//                 >
//                   <path
//                     d="M 40 0 L 0 0 0 40"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="1"
//                     strokeOpacity="0.3"
//                   />
//                 </pattern>
//               </defs>
//               <rect width="100%" height="100%" fill="url(#gridPattern)" />
//             </svg>
//           </div>

//           {/* HERO SECTION */}
//           <AnimateIfVisible
//             className="relative flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-6 lg:px-8"
//             delay={0.1}
//           >
//             <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
//               Discover More, Faster with{" "}
//               <span className="text-indigo-600">AI-Driven PDF Chat</span>
//             </h1>
//             <p className="mt-4 text-lg text-gray-500 max-w-2xl">
//               Meet <span className="font-bold text-indigo-600">LucidDocs</span>{" "}
//               — Upload any document and ask questions directly. Get fast,
//               accurate answers powered by cutting-edge AI.
//             </p>

//             <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
//               <Button className="mt-8 bg-indigo-500 cursor-pointer hover:bg-indigo-600">
//                 Get Started
//               </Button>
//             </SignUpButton>

//             <div className="mt-10 relative w-full max-w-3xl mx-auto">
//               <Image
//                 alt="Hero illustration"
//                 src="/p5.png"
//                 width={832}
//                 height={843}
//                 priority
//                 className="shadow-xl ring-1 ring-gray-900/10 rounded-md"
//                 onContextMenu={(e) => e.preventDefault()}
//                 draggable={false}
//               />
//             </div>
//           </AnimateIfVisible>

//           {/* FEATURES */}
//           <AnimateIfVisible className="mx-auto mt-20 max-w-5xl px-6" delay={0.2}>
//             <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-gray-700">
//               {features.map((f) => (
//                 <div key={f.name} className="relative px-8">
//                   <dt className="inline font-semibold text-gray-700">
//                     <f.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
//                     <span className="ml-6">{f.name}</span>
//                   </dt>
//                   <dd className="mt-2 text-gray-600">{f.desc}</dd>
//                 </div>
//               ))}
//             </dl>
//           </AnimateIfVisible>

//           {/* REVIEWS */}
//           <AnimateIfVisible
//             className="relative py-20 mt-24 px-6 lg:px-8"
//             delay={0.3}
//           >
//             <div className="max-w-6xl mx-auto text-center">
//               <h2 className="text-3xl font-bold text-gray-800 mb-12">
//                 What Our Users Say
//               </h2>
//               <div className="grid md:grid-cols-3 gap-8">
//                 {[ /* reviews content unchanged */ ].map((person, i) => (
//                   <motion.div
//                     key={i}
//                     className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
//                     initial={{ opacity: 0, y: 40 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     viewport={{ once: true }}
//                     transition={{ duration: 0.6, delay: 0.2 * i }}
//                   >
//                     <div className="flex justify-center mb-3">
//                       {[...Array(5)].map((_, idx) => (
//                         <Star
//                           key={idx}
//                           className="h-5 w-5 text-yellow-400 fill-yellow-400"
//                         />
//                       ))}
//                     </div>
//                     <p className="text-gray-600 italic mb-4">
//                       “{person.review}”
//                     </p>
//                     <h4 className="font-semibold text-gray-800">
//                       {person.name}
//                     </h4>
//                     <span className="text-sm text-gray-500">{person.role}</span>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           </AnimateIfVisible>

//           {/* FAQ */}
//           <AnimateIfVisible className="relative py-16 px-6 lg:px-8" delay={0.4}>
//             <div className="max-w-5xl mx-auto">
//               <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
//                 <span className="block sm:hidden">FAQs</span>
//                 <span className="hidden sm:block">
//                   Frequently Asked Questions
//                 </span>
//               </h2>

//               <div className="space-y-4">
//                 {faqs.map((item, i) => (
//                   <div
//                     key={i}
//                     className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white/90 backdrop-blur-sm"
//                     onClick={() => toggleFAQ(i)}
//                   >
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-semibold text-gray-800">{item.q}</h3>
//                       <ChevronDown
//                         className={`h-5 w-5 text-indigo-600 transition-transform duration-300 ${
//                           activeIndex === i ? "rotate-180" : ""
//                         }`}
//                       />
//                     </div>
//                     <motion.div
//                       initial={false}
//                       animate={{
//                         height: activeIndex === i ? "auto" : 0,
//                         opacity: activeIndex === i ? 1 : 0,
//                       }}
//                       transition={{ duration: 0.3 }}
//                       className="overflow-hidden"
//                     >
//                       <p className="mt-3 text-gray-600 text-sm leading-relaxed">
//                         {item.a}
//                       </p>
//                     </motion.div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </AnimateIfVisible>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }



// // "use client";

// // import { SignUpButton } from "@clerk/nextjs";
// // import { Button } from "@/components/ui/button";
// // import {
// //   GlobeIcon,
// //   Lock,
// //   MessageCircle,
// //   MonitorSmartphoneIcon,
// //   ServerCogIcon,
// //   ZapIcon,
// //   Star,
// //   ChevronDown,
// // } from "lucide-react";
// // import Image from "next/image";
// // import { useState } from "react";
// // import { motion } from "framer-motion";
// // import { useInView } from "react-intersection-observer";
// // import Head from "next/head";
// // import Footer from "./Footer/Footer";

// // // ✅ Animate on view (lightweight, performant)
// // const AnimateIfVisible = ({ children, className, delay = 0 }) => {
// //   const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
// //   return (
// //     <motion.div
// //       ref={ref}
// //       className={className}
// //       initial={{ opacity: 0, y: 30 }}
// //       animate={inView ? { opacity: 1, y: 0 } : {}}
// //       transition={{ duration: 0.6, delay }}
// //     >
// //       {children}
// //     </motion.div>
// //   );
// // };

// // // ✅ Features
// // const features = [
// //   {
// //     name: "Instant Summaries",
// //     desc: "Get concise summaries of entire documents or specific sections in seconds, perfect for research or reports.",
// //     icon: GlobeIcon,
// //   },
// //   {
// //     name: "Smart Question Answering",
// //     desc: "Quickly ask any question from your PDF, and get direct, accurate answers without sifting through lengthy documents.",
// //     icon: ZapIcon,
// //   },
// //   {
// //     name: "Secure & Private Processing",
// //     desc: "Your documents are handled securely with data encryption and no unintended data sharing.",
// //     icon: Lock,
// //   },
// //   {
// //     name: "Chat Naturally",
// //     desc: "Interact with your documents using plain language; our smart chat understands your questions and keeps the conversation flowing.",
// //     icon: MessageCircle,
// //   },
// //   {
// //     name: "Lightning Fast Responses",
// //     desc: "Enjoy seamless, real-time conversations with your PDFs, saving you valuable time with every chat.",
// //     icon: ServerCogIcon,
// //   },
// //   {
// //     name: "Multi-Device Access",
// //     desc: "Work seamlessly across desktop, tablet, or phone so you can chat with your PDFs anywhere.",
// //     icon: MonitorSmartphoneIcon,
// //   },
// // ];

// // // ✅ FAQ
// // const faqs = [
// //   {
// //     q: "Is my data secure?",
// //     a: "Yes. All uploaded PDFs are encrypted, and LucidDocs never shares your data with third parties.",
// //   },
// //   {
// //     q: "Can I use LucidDocs for scanned PDFs?",
// //     a: "Absolutely! We use OCR technology to extract text from scanned PDFs for chat and summarization.",
// //   },
// //   {
// //     q: "Do I need an account to try it?",
// //     a: "You can test the demo without an account, but sign-up unlocks history, saved docs, and full AI access.",
// //   },
// //   {
// //     q: "Which file formats are supported?",
// //     a: "Currently, LucidDocs supports PDF files, with DOCX and TXT support coming soon.",
// //   },
// // ];

// // export default function Home() {
// //   const [activeIndex, setActiveIndex] = useState(null);

// //   const toggleFAQ = (index) => {
// //     setActiveIndex(activeIndex === index ? null : index);
// //   };

// //   // ✅ Structured data (for Google FAQ rich results)
// //   const faqSchema = {
// //     "@context": "https://schema.org",
// //     "@type": "FAQPage",
// //     mainEntity: faqs.map((faq) => ({
// //       "@type": "Question",
// //       name: faq.q,
// //       acceptedAnswer: {
// //         "@type": "Answer",
// //         text: faq.a,
// //       },
// //     })),
// //   };

// //   return (
// //     <>
// //       {/* ✅ SEO Meta Tags */}
// //       <Head>
// //         <title>LucidDocs - AI PDF Chat & Summaries</title>
// //         <meta
// //           name="description"
// //           content="Upload any PDF and chat with it instantly. Get summaries, answers, and insights with AI-powered LucidDocs."
// //         />
// //         <meta
// //           name="keywords"
// //           content="AI PDF chat, PDF summarizer, LucidDocs, AI assistant, PDF AI, PDF analysis"
// //         />
// //         <meta name="robots" content="index, follow" />
// //         <meta
// //           property="og:title"
// //           content="LucidDocs - AI PDF Chat & Summaries"
// //         />
// //         <meta
// //           property="og:description"
// //           content="Upload any PDF and chat with it instantly. Get summaries, answers, and insights with AI-powered LucidDocs."
// //         />
// //         <meta property="og:type" content="website" />
// //         <meta property="og:url" content="https://yourwebsite.com" />
// //         <meta property="og:image" content="/p5.png" />
// //         <meta name="twitter:card" content="summary_large_image" />
// //         <script
// //           type="application/ld+json"
// //           dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
// //         />
// //       </Head>

// //       {/* ✅ Main Content */}
// //       <main className="relative flex-1 bg-gradient-to-bl from-white to-indigo-800 min-h-screen">
// //         <div className="relative bg-white py-24 sm:py-30 drop-shadow-xl overflow-hidden">

// //           <div className="absolute inset-x-0 top-0 h-full opacity-100 pointer-events-none">
// //             <svg
// //               className="w-full h-full text-indigo-600"
// //               xmlns="http://www.w3.org/2000/svg"
// //               fill="none"
// //             >
// //               <defs>
// //                 <pattern
// //                   id="gridPattern"
// //                   x="0"
// //                   y="0"
// //                   width="40"
// //                   height="40"
// //                   patternUnits="userSpaceOnUse"
// //                 >
// //                   <path
// //                     d="M 40 0 L 0 0 0 40"
// //                     fill="none"
// //                     stroke="currentColor"
// //                     strokeWidth="1"
// //                     strokeOpacity="0.3"
// //                   />
// //                 </pattern>
// //               </defs>
// //               <rect width="100%" height="100%" fill="url(#gridPattern)" />
// //             </svg>
// //           </div>


// //           <AnimateIfVisible
// //             className="relative flex flex-col justify-center items-center text-center max-w-7xl mx-auto px-6 lg:px-8"
// //             delay={0.1}
// //           >
// //             <h1 className="text-3xl sm:text-5xl font-bold text-gray-800">
// //               Discover More, Faster with{" "}
// //               <span className="text-indigo-600">AI-Driven PDF Chat</span>
// //             </h1>
// //             <p className="mt-4 text-lg text-gray-500 max-w-2xl">
// //               Meet <span className="font-bold text-indigo-600">LucidDocs</span>{" "}
// //               — Upload any document and ask questions directly. Get fast,
// //               accurate answers powered by cutting-edge AI.
// //             </p>

// //             <SignUpButton mode="redirect" forceRedirectUrl="/dashboard">
// //               <Button className="mt-8 bg-indigo-500 cursor-pointer hover:bg-indigo-600">
// //                 Get Started
// //               </Button>
// //             </SignUpButton>


// //             <div className="mt-10 relative w-full max-w-3xl mx-auto">
// //               <Image
// //                 alt="Hero illustration"
// //                 src="/p5.png"
// //                 width={832}
// //                 height={843}
// //                 priority
// //                 className="shadow-xl ring-1 ring-gray-900/10 rounded-md"
// //                 onContextMenu={(e) => e.preventDefault()}
// //                 draggable={false}
// //               />
// //             </div>
// //           </AnimateIfVisible>

// //           {/* 🔹 Features Section */}
// //           <AnimateIfVisible
// //             className="mx-auto mt-20 max-w-5xl px-6"
// //             delay={0.2}
// //           >
// //             <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-gray-700">
// //               {features.map((f) => (
// //                 <div key={f.name} className="relative px-8">
// //                   <dt className="inline font-semibold text-gray-700">
// //                     <f.icon className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
// //                     <span className="ml-6">{f.name}</span>
// //                   </dt>
// //                   <dd className="mt-2 text-gray-600">{f.desc}</dd>
// //                 </div>
// //               ))}
// //             </dl>
// //           </AnimateIfVisible>

// //           {/* 🔹 Reviews Section */}
// //           <AnimateIfVisible
// //             className="relative py-20 mt-24 px-6 lg:px-8"
// //             delay={0.3}
// //           >
// //             <div className="max-w-6xl mx-auto text-center">
// //               <h2 className="text-3xl font-bold text-gray-800 mb-12">
// //                 What Our Users Say
// //               </h2>
// //               <div className="grid md:grid-cols-3 gap-8">
// //                 {[
// //                   {
// //                     name: "Sarah Mitchell",
// //                     role: "Research Student",
// //                     review:
// //                       "LucidDocs has completely changed how I study. I can summarize 100-page papers in minutes!",
// //                   },
// //                   {
// //                     name: "James Carter",
// //                     role: "Legal Analyst",
// //                     review:
// //                       "Perfect for reviewing case files. I just ask questions and get exactly what I need instantly.",
// //                   },
// //                   {
// //                     name: "Priya Desai",
// //                     role: "Product Manager",
// //                     review:
// //                       "The speed and accuracy blew me away. It’s like having an AI assistant for all my reports.",
// //                   },
// //                 ].map((person, i) => (
// //                   <motion.div
// //                     key={i}
// //                     className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
// //                     initial={{ opacity: 0, y: 40 }}
// //                     whileInView={{ opacity: 1, y: 0 }}
// //                     viewport={{ once: true }}
// //                     transition={{ duration: 0.6, delay: 0.2 * i }}
// //                   >
// //                     <div className="flex justify-center mb-3">
// //                       {[...Array(5)].map((_, idx) => (
// //                         <Star
// //                           key={idx}
// //                           className="h-5 w-5 text-yellow-400 fill-yellow-400"
// //                         />
// //                       ))}
// //                     </div>
// //                     <p className="text-gray-600 italic mb-4">
// //                       “{person.review}”
// //                     </p>
// //                     <h4 className="font-semibold text-gray-800">
// //                       {person.name}
// //                     </h4>
// //                     <span className="text-sm text-gray-500">{person.role}</span>
// //                   </motion.div>
// //                 ))}
// //               </div>
// //             </div>
// //           </AnimateIfVisible>

// //           {/* 🔹 FAQ Section */}
// //           <AnimateIfVisible className="relative py-16 px-6 lg:px-8" delay={0.4}>
// //             <div className="max-w-5xl mx-auto">
// //               <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
// //                 <span className="block sm:hidden">FAQs</span>
// //                 <span className="hidden sm:block">
// //                   Frequently Asked Questions
// //                 </span>
// //               </h2>
// //               <div className="space-y-4">
// //                 {faqs.map((item, i) => (
// //                   <div
// //                     key={i}
// //                     className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-white/90 backdrop-blur-sm"
// //                     onClick={() => toggleFAQ(i)}
// //                   >
// //                     <div className="flex justify-between items-center">
// //                       <h3 className="font-semibold text-gray-800">{item.q}</h3>
// //                       <ChevronDown
// //                         className={`h-5 w-5 text-indigo-600 transition-transform duration-300 ${
// //                           activeIndex === i ? "rotate-180" : ""
// //                         }`}
// //                       />
// //                     </div>
// //                     <motion.div
// //                       initial={false}
// //                       animate={{
// //                         height: activeIndex === i ? "auto" : 0,
// //                         opacity: activeIndex === i ? 1 : 0,
// //                       }}
// //                       transition={{ duration: 0.3 }}
// //                       className="overflow-hidden"
// //                     >
// //                       <p className="mt-3 text-gray-600 text-sm leading-relaxed">
// //                         {item.a}
// //                       </p>
// //                     </motion.div>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </AnimateIfVisible>
// //         </div>
// //       </main>
// //       <Footer />
// //     </>
// //   );
// // }
