# LucidDocs – AI-Powered PDF Assistant

LucidDocs is an AI-driven web application that allows users to upload PDFs and interact intelligently with their documents.
Ask questions, get summaries, extract information, or understand complex material — all through a simple, elegant UI.

___

🚀 Features

📄 Upload PDF files 

🤖 AI-powered chat with your document

🔍 Ask questions and receive context-aware answers based on PDF content

📝 Summaries, explanations, key points extraction

⚡ Fast, responsive UI

🎨 Clean and modern design

___

# 🧩 How It Works

User uploads a PDF
The file is processed & converted to readable chunks
The AI model retrieves the relevant context
User asks questions → AI responds using the extracted content
The app behaves like a personal document tutor.

___

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| Framework     | **Next.js 14 / App Router**                                 |
| Frontend      | **React**, **TailwindCSS**, **ShadCN UI**                   |
| Backend       | Convex / API routes (depending on your setup)               |
| AI            | Gemini Flash                                                |
| File Handling | PDF parsing + custom logic                                  |
| Deployment    | Vercel                                                      |


LucidDocs---AI-PDF/
│── app/                 # Next.js App Router pages & routes

│── components/          # Reusable UI & functional components

│── configs/             # App-wide configs and constants

│── convex/              # Backend functions (if using Convex)

│── lib/                # Utility functions, helpers

│── public/            # Static files, images, icons

│── styles/            # Global styles

│── package.json

│── README.md          # (You are reading this)

___

🧪 Running Locally
1️⃣ Clone the repository

git clone https://github.com/YashSikarwar28/LucidDocs---AI-PDF.git
cd LucidDocs---AI-PDF

2️⃣ Install dependencies

npm install
# or
yarn install

3️⃣ Add your environment variables

Create a .env.local and include what your app needs:
GEMINI_API_KEY=your_key_here
CONVEX_DEPLOYMENT=...
(Adjust to your backend setup.)

4️⃣ Start the development server
npm run dev

Server runs at:

👉 http://localhost:3000

🌐 Deployment

Easily deploy on Vercel:

Push repo to GitHub

Go to https://vercel.com

Import the project

Add environment variables

Deploy ✨

🤝 Contributing

Contributions are welcome!
Steps to Contribute
Fork the repository
Create your feature branch
git checkout -b feature-name

Commit changes
git commit -m "Added new feature"


Push branch
git push origin feature-name
