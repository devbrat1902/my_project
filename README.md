# My Project - Premium Marketplace

A modern, feature-rich marketplace web application built with Next.js, TypeScript, and Tailwind CSS. Features a stunning UI with glassmorphism effects, smooth animations, and a fully responsive design.

## ✨ Features

- **🏠 Homepage**: Eye-catching hero section with gradient text, feature cards, and statistics
- **🛍️ Product Listing Page**: Marketplace-style layout with:
  - Top search bar for product discovery
  - Left sidebar with collapsible filters (categories, price range, ratings)
  - Responsive product grid (1-4 columns based on screen size)
  - Individual product cards with thumbnails, titles, prices, ratings, and preview buttons
- **🎨 Premium Design**: 
  - Dark theme with vibrant gradient colors
  - Glassmorphism effects with backdrop blur
  - Smooth micro-animations and hover effects
  - Custom scrollbar styling
- **📱 Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **⚡ Fast Performance**: Built with Next.js 15 and optimized for speed

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Fonts**: [Inter](https://fonts.google.com/specimen/Inter) (via Google Fonts)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory:
```bash
cd my_project
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
my_project/
├── app/
│   ├── globals.css          # Global styles with custom animations & utilities
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── products/
│       └── page.tsx          # Product listing page
├── components/
│   ├── SearchBar.tsx         # Search input component
│   ├── FilterSidebar.tsx     # Collapsible filter sidebar
│   └── ProductCard.tsx       # Individual product card
├── public/                   # Static assets
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## 🎨 Design Highlights

- **Color Palette**: Custom indigo, pink, and purple gradients
- **Typography**: Inter font family for modern, clean text
- **Animations**: Fade-in, slide-in, scale-in, and float effects
- **Components**: Reusable, modular component architecture
- **State Management**: React hooks for interactive filters

## 🌐 Routes

- `/` - Homepage with hero section and features
- `/products` - Product listing page with filters and search

## 📝 License

This project was created for demonstration purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and TypeScript
