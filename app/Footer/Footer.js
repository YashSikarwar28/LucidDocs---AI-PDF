import { Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray-700 border-t border-gray-200">
      <div className="h-[2px] w-full bg-purple-200" />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">

          <div className="max-w-xl">
            <h2 className="text-2xl font-bold text-purple-600">LucidDocs</h2>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Chat with your PDFs, get instant answers, and summarize long
              documents effortlessly — powered by AI.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lets Connect
            </h3>

            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/YashSikarwar28"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-purple-600 transition transform hover:scale-110"
              >
                <Github size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/yash-sikarwar-sist/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-purple-600 transition transform hover:scale-110"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="https://x.com/YashSikarwar28"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-purple-600 transition transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>

              <a
                href="mailto:yashsikarwar005@gmail.com"
                aria-label="Email"
                className="hover:text-purple-600 transition transform hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
        <p className="text-center sm:text-left">
          © {currentYear}{" "}
          <span className="text-gray-900 font-semibold">LucidDocs</span>. All
          rights reserved.
        </p>

        <p className="text-center sm:text-right mt-2 sm:mt-0 text-gray-600">
          Coded with <span className="text-red-500">❤️</span> by{" "}
          <span className="font-semibold text-gray-800">Yash</span>
        </p>
      </div>
    </footer>
  );
}

