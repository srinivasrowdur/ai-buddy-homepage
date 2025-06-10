# AI Buddy Homepage

A beautiful, modern landing page for an AI companion platform built with Next.js 15, TypeScript, and Tailwind CSS. This website showcases the capabilities of creating personalised AI companions and encourages users to build their own AI buddies.

![AI Buddy Homepage](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

- **Modern Design**: Clean, responsive interface with purple gradient branding
- **Interactive Components**: Hover effects, smooth animations, and engaging UI elements
- **Mobile-First**: Fully responsive design that works perfectly on all devices
- **Performance Optimised**: Built with Next.js 15 for optimal loading speeds
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Type-Safe**: Full TypeScript implementation for robust development

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-buddy-homepage
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-buddy-homepage/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Homepage component
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui component library
│   ├── ai-personality-card.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── testimonial-card.tsx
├── public/               # Static assets
├── styles/              # Additional styling
└── lib/                 # Utility functions
```

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety and better developer experience

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful, customisable icons

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🎨 Design System

### Colour Palette
- **Primary**: Purple (#7C3AED)
- **Secondary**: Pink gradient accents
- **Neutral**: Various greys for text and backgrounds
- **Success**: Green for positive actions

### Typography
- **Font**: System fonts for optimal performance
- **Scale**: Consistent spacing and sizing using Tailwind's design tokens

## 🌐 Page Sections

1. **Hero Section** - Main value proposition with call-to-action
2. **Features** - Three key benefits of the platform
3. **AI Personalities** - Showcase of example AI companions
4. **How It Works** - Simple 3-step process explanation
5. **Testimonials** - Social proof from satisfied users
6. **Final CTA** - Conversion-focused sign-up section

## 📱 Responsive Design

The website is built mobile-first and includes:
- **Mobile**: Optimised navigation with hamburger menu
- **Tablet**: Adjusted layouts for medium screens
- **Desktop**: Full-featured experience with hover states

## 🚀 Performance Features

- **Image Optimisation**: Next.js automatic image optimisation
- **Code Splitting**: Automatic code splitting for faster loads
- **SSR/SSG**: Server-side rendering for better SEO
- **Bundle Analysis**: Optimised bundle sizes

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Package Management
pnpm install      # Install dependencies
pnpm add <pkg>    # Add new dependency
```

## 🌍 Browser Support

- **Chrome** 88+
- **Firefox** 85+
- **Safari** 14+
- **Edge** 88+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the excellent component library
- **Radix UI** for accessible primitives
- **Tailwind CSS** for the utility-first approach
- **Next.js** team for the amazing framework

## 📞 Support

If you have any questions or issues, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ using Next.js and TypeScript** 