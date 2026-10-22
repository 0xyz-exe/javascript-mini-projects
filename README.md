# JavaScript Mini Projects

16+ professional JavaScript projects demonstrating browser APIs, async programming, Node.js, testing, and real-time communication.

## 📋 Project List

| # | Project | Description | Technologies |
|---|---------|-------------|--------------|
| 01 | [JS Playground](projects/01-js-playground) | Interactive browser-based code playground | HTML, CSS, JavaScript, iframe sandbox |
| 02 | [Task Manager](projects/02-task-manager) | Advanced task management with persistence | JavaScript, IndexedDB |
| 03 | [Weather Dashboard](projects/03-weather-dashboard) | Weather app using Open-Meteo API | JavaScript, Fetch API |
| 04 | [GitHub Explorer](projects/04-github-explorer) | GitHub profile and repository explorer | JavaScript, GitHub REST API |
| 05 | [Expense Tracker](projects/05-expense-tracker) | Personal finance tracker | JavaScript, localStorage |
| 06 | [REST API](projects/06-rest-api) | Task API with Node.js http module | Node.js, REST |
| 07 | [File Organizer](projects/07-file-organizer) | CLI tool for organizing files | Node.js, fs |
| 08 | [Async Job Queue](projects/08-async-job-queue) | Promise-based job queue | JavaScript, Promises |
| 09 | [Real-Time Chat](projects/09-realtime-chat) | WebSocket chat application | Node.js, WebSocket, ws |
| 10 | [Markdown Notes](projects/10-markdown-notes) | Note-taking with Markdown | JavaScript, localStorage |
| 11 | [URL Shortener](projects/11-url-shortener) | URL shortening service | Node.js, SQLite, better-sqlite3 |
| 12 | [Data Toolkit](projects/12-data-toolkit) | Data transformation utilities | JavaScript, Node.js |
| 13 | [Performance Analyzer](projects/13-performance-analyzer) | Web performance metrics | JavaScript, Fetch API |
| 14 | [Algorithm Visualizer](projects/14-algorithm-visualizer) | Interactive algorithm visualization | JavaScript, Canvas/DOM |
| 15 | [Local Search Engine](projects/15-local-search-engine) | Search for local text files | Node.js, Inverted Index |
| 16 | [Nexus Arcade](projects/16-nexus-arcade) | Browser-based arcade with 51 playable games | HTML, CSS, JavaScript, Canvas/DOM |

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ (LTS recommended)
- Modern web browser (Chrome, Firefox, Edge)
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/yourusername/javascript-mini-projects.git
cd javascript-mini-projects

# Install dependencies (for projects that need them)
cd projects/09-realtime-chat && npm install && cd ../..
cd projects/11-url-shortener && npm install && cd ../..
```

### Running Projects

**Browser Projects (01-05, 10, 14, 16):**
```bash
# Open the index.html file in your browser
# Example:
open projects/01-js-playground/src/index.html
```

**Node.js CLI/Server Projects (06-09, 11-13, 15):**
```bash
# Example: REST API
node projects/06-rest-api/src/server.js

# Example: File Organizer
node projects/07-file-organizer/src/organizer.js --help

# Example: Chat Server
cd projects/09-realtime-chat
npm install
node src/server.js
```

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run specific project tests:
```bash
node --test projects/02-task-manager/tests/*.test.js
node --test projects/08-async-job-queue/tests/*.test.js
```

## 📁 Repository Structure

```
javascript-mini-projects/
├── README.md
├── LICENSE
├── package.json
├── projects/
│   ├── 01-js-playground/
│   │   ├── README.md
│   │   ├── src/
│   │   └── tests/
│   ├── 02-task-manager/
│   └── ... (16 projects total)
└── .gitignore
```

Each project has:
- `README.md` - Project documentation
- `src/` - Source code
- `tests/` - Unit tests (where applicable)

## 🛠️ Technologies Used

- **JavaScript** ES2022+ (async/await, modules, destructuring)
- **Node.js** Built-in modules (http, fs, path)
- **Browser APIs** Fetch, localStorage, IndexedDB, WebSocket
- **Testing** Node.js test runner
- **No frameworks** Pure JavaScript implementations
- **Minimal dependencies** ws, better-sqlite3 only

## 📚 Features by Category

### Browser Development
- DOM manipulation
- Event handling
- Local storage
- IndexedDB
- Canvas/visualization

### Asynchronous Programming
- Promises
- async/await
- AbortController
- Fetch API
- WebSocket

### Node.js
- HTTP server
- File system operations
- CLI tools
- Streams

### Data Processing
- JSON/CSV parsing
- Data transformation
- Validation
- Search algorithms

### Real-Time Communication
- WebSocket protocol
- Message queuing
- Rate limiting

## 🔒 Security

All projects follow secure coding practices:
- Input validation
- Output encoding
- No hardcoded credentials
- Localhost binding by default
- Request timeouts
- Payload size limits

**Note:** These are educational projects. Additional hardening required for production use.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Submit a pull request

## 🎯 Learning Objectives

This repository demonstrates:
- Modern JavaScript patterns
- Async programming techniques
- Node.js fundamentals
- API integration
- Data persistence
- Testing practices
- Security considerations
- CLI development
- Real-time communication

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check individual project READMEs for specific documentation

## 🙏 Acknowledgments

- Open-Meteo for free weather API
- GitHub for public REST API
- Node.js and browser communities

---

**Built with JavaScript** | **No frameworks** | **Practical examples** | **Production-ready patterns**
