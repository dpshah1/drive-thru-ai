# Presto - AI-Powered Restaurant Customer Service

Presto is a Next.js application that revolutionizes restaurant customer service by creating AI-powered ordering agents. The app allows restaurants to upload their PDF menus, automatically extract menu items and nutrition information using Google Gemini AI, and generate intelligent customer service agents that can handle orders, answer questions about ingredients and allergens, and provide personalized recommendations.

## 🚀 Features

### Core Functionality
- **Restaurant Management**: Create and manage restaurant profiles with location and menu information
- **PDF Menu Processing**: Upload PDF menus and automatically extract menu items using Google Gemini AI
- **AI Customer Service**: Generate AI-powered customer service agents for each restaurant
- **Nutrition Information**: Extract and store detailed nutrition facts, ingredients, and allergen information
- **Smart Recommendations**: AI agents can provide personalized recommendations based on dietary restrictions

### Technical Features
- **Real-time Processing**: Instant PDF analysis and menu item extraction
- **Error Handling**: Robust error handling with retry logic for API rate limits
- **Responsive Design**: Modern, mobile-friendly interface
- **Database Integration**: Secure data storage with Supabase
- **Vercel Optimized**: Fully compatible with Vercel deployment

## 🏗️ How It Works

### 1. Restaurant Creation
Restaurants start by creating a profile through the add-store interface:
- Enter restaurant name and location
- Upload PDF menu files (combine multiple PDFs into one for best results)
- System automatically processes and stores the information

### 2. PDF Processing Pipeline
The PDF processing follows this workflow:
1. **File Upload**: PDFs are uploaded to the server
2. **AI Analysis**: Google Gemini AI analyzes the PDF content
3. **Data Extraction**: Menu items, prices, nutrition facts, and ingredients are extracted
4. **Database Storage**: All information is stored in Supabase with proper relationships
5. **Error Handling**: Retry logic handles API rate limits and processing errors

### 3. AI Customer Service Generation
Once menu data is processed:
- Each restaurant gets its own AI customer service agent
- Agents can answer questions about menu items, ingredients, and allergens
- Personalized recommendations based on dietary restrictions
- Natural language processing for customer interactions

### 4. Customer Interaction
Customers can:
- Browse restaurant menus with detailed information
- Ask questions about ingredients and allergens
- Get personalized recommendations
- Place orders through the AI agent

## 🛠️ Technical Architecture

### Frontend
- **Next.js 15**: React framework with App Router
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Responsive Design**: Mobile-first approach with modern UI components

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Google Gemini AI**: Advanced AI model for PDF processing and text extraction
- **Supabase**: PostgreSQL database with real-time capabilities
- **File Processing**: In-memory file handling for Vercel compatibility

### Database Schema
```
restaurants:
  - id (primary key)
  - name
  - location
  - created_at

menu_items:
  - id (primary key)
  - restaurant_id (foreign key)
  - item (menu item name)
  - info (nutrition facts, ingredients, allergens, prices)
  - created_at
```

### API Endpoints
- `POST /api/upload-menu`: Handle PDF file uploads
- `POST /api/process-menu`: Process PDFs with Gemini AI and store menu items
- `GET /api/restaurant/[id]`: Retrieve restaurant and menu data
- `POST /api/test`: Testing endpoint for development

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Google Gemini API key
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd drive-thru-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Create the `restaurants` and `menu_items` tables with the schema above
   - Copy your project URL and anon key to the environment variables

5. **Get Google Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
drive-thru-ai/
├── src/
│   ├── app/
│   │   ├── add-store/          # Restaurant creation form
│   │   ├── api/                # API routes
│   │   │   ├── process-menu/   # PDF processing with Gemini AI
│   │   │   ├── upload-menu/    # File upload handling
│   │   │   └── restaurant/     # Restaurant data endpoints
│   │   ├── restaurant/         # Restaurant listing and detail pages
│   │   └── vapi/              # AI customer service interface
│   ├── lib/
│   │   └── supabaseClient.js  # Supabase client configuration
│   └── globals.css            # Global styles
├── public/                    # Static assets
└── package.json              # Dependencies and scripts
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in the Vercel dashboard
   - Deploy

### Environment Variables for Production
Make sure to add these in your Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_GEMINI_API_KEY`

## 🔧 Development

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

### Key Development Notes
- **File Uploads**: Files are processed in memory for Vercel compatibility
- **API Rate Limits**: Google Gemini API has rate limits; the app includes retry logic
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Testing**: Test PDF uploads with sample menu files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini AI**: For advanced PDF processing capabilities
- **Supabase**: For the excellent database and real-time features
- **Next.js Team**: For the amazing React framework
- **Vercel**: For seamless deployment and hosting

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

**Presto** - Transforming restaurant customer service with AI technology.
