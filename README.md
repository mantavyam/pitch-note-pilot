# NotesGlider

A modern, intuitive document editor that combines the power of structured note-taking with visual mind mapping. NotesGlider provides a dual-view experience where users can seamlessly switch between a detailed WriteUp view and an interactive MindMap visualization.

## 🌟 Features

### WriteUp View
- **VSCode-style Minimap**: Navigate large documents with ease using the bird's eye view minimap with drag-to-scroll functionality
- **Rich Text Editing**: Full-featured rich text editor with support for bold, italic, bullet points, numbered lists, and more
- **Advanced Table Editor**: Comprehensive table management with add/remove columns/rows, reordering, and intuitive controls
- **Drag & Drop Images**: Simply drag and drop images directly into image blocks
- **Unified Container Design**: Clean, Notion-like layout with minimal padding and unified containers
- **Single-Click Editing**: Immediate text editing with single-click activation
- **Circular Action Buttons**: Modern, intuitive circular add buttons with helpful tooltips

### MindMap View
- **Professional Color Theme**: Vibrant yet professional color scheme for enhanced visual appeal
- **Logic Chart Structure**: Clean, organized layout based on logic chart principles
- **Simplified Connections**: Clean lines without distracting animations or dotted patterns
- **Auto-balancing Layout**: Intelligent spacing to prevent node overlapping
- **Enhanced Navigation**: Horizontal and vertical scrolling with zoom capabilities
- **Unified News Entity Representation**: Cohesive display of related content

### Document Management
- **Hierarchical Structure**: Organize content with News Categories and Headlines
- **Simplified Document Outline**: Clean table-of-contents style navigation
- **Drag & Drop Reordering**: Intuitive content organization
- **Real-time Updates**: Changes reflect immediately across both views

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd notesglider-pilot
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

### Creating a New Document
1. Click the "Add Your First Category" button to create a new document
2. Enter a date-based title for your document
3. Optionally add a YouTube reference URL

### Working with Content
1. **Adding Categories**: Use the circular "+" button to add new news categories
2. **Adding Content**: Within each category, add headlines, descriptions, images, and tables
3. **Editing Text**: Single-click any text element to start editing immediately
4. **Managing Tables**: Use the advanced table editor to add/remove columns and rows
5. **Organizing Content**: Drag and drop to reorder news entities

### Switching Views
- Use the view toggle to switch between WriteUp and MindMap views
- Both views stay synchronized with your content changes
- Use the minimap in WriteUp view for quick navigation

## 🏗️ Architecture

### Technology Stack
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives with custom styling
- **Rich Text**: Tiptap editor with StarterKit extensions
- **Mind Mapping**: React Flow (xyflow) for interactive diagrams
- **Drag & Drop**: dnd-kit for intuitive interactions
- **State Management**: React hooks with custom stores
- **TypeScript**: Full type safety throughout the application

### Project Structure
```
├── app/                    # Next.js app directory
├── components/
│   ├── editor/            # Core editor components
│   │   ├── blocks/        # Content block components
│   │   ├── views/         # WriteUp and MindMap views
│   │   └── drag-drop/     # Drag and drop functionality
│   └── ui/                # Reusable UI components
├── lib/
│   ├── stores/            # State management
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
└── public/                # Static assets
```

### Key Components
- **DocumentEditor**: Main editor container with view switching
- **WriteUpView**: Structured document editing interface
- **MindMapView**: Visual mind map representation
- **NodeBlock**: Individual news category containers
- **SubNodeBlock**: Content elements (headlines, descriptions, etc.)
- **EditorMinimap**: VSCode-style navigation minimap

## 🎨 Design Philosophy

NotesGlider follows a clean, modern design philosophy inspired by popular productivity tools:

- **Notion-like Compactness**: Minimal padding and unified containers for efficient space usage
- **VSCode-inspired Navigation**: Familiar minimap and editing patterns
- **Professional Color Palette**: Carefully chosen colors that are both vibrant and professional
- **Intuitive Interactions**: Single-click editing, drag & drop, and clear visual feedback

## 🤝 Contributing

We welcome contributions to NotesGlider! Here's how you can help:

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow the existing code style and formatting
- Add appropriate comments for complex logic
- Ensure all components are properly typed
- Test your changes across both WriteUp and MindMap views

### Areas for Contribution
- Additional rich text formatting options
- Enhanced table editing features
- New content block types
- Improved accessibility features
- Performance optimizations
- Mobile responsiveness improvements

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components powered by [Radix UI](https://www.radix-ui.com/)
- Rich text editing by [Tiptap](https://tiptap.dev/)
- Mind mapping with [React Flow](https://reactflow.dev/)
- Drag and drop by [dnd-kit](https://dndkit.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**NotesGlider** - Where structured thinking meets visual creativity.
