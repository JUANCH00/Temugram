# Causal Consistency — Interactive Demo

An interactive React application that demonstrates **causal consistency** in distributed systems through a comment system replicated across multiple servers.

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat&logo=react)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## Description

This project simulates a distributed comment system with three independent servers that maintain causal consistency. It demonstrates how events (comments and replies) propagate across servers while respecting causality relationships — ensuring that replies never appear before their parent comments.

### Key Features

- **Three distributed servers** simulating independent replicas
- **Variable network latencies** between servers
- **Causality preservation** using vector clocks
- **Nested comment and reply system**
- **Automatic synchronization** across servers
- **Pending event queue** for events awaiting their dependencies
- **Real-time visualization** of each server's state

## Concepts Demonstrated

### Causal Consistency

Causal consistency guarantees that:
- If event A causes event B, all servers will see A before B
- Replies always appear after their parent comments
- Causally unrelated events may appear in different orders on different servers

### Vector Clocks

Each event carries a vector clock that tracks the logical state of the system, enabling causal relationship detection between distributed events.

## 🚀 Installation

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/causal-consistency-demo.git

# Enter the project directory
cd causal-consistency-demo

# Install dependencies
npm install

# Start the application
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Select a server** — click one of the three server buttons (Server-A, Server-B, Server-C)
2. **Create a comment** — type a message in the text field and click "Publish"
3. **Reply to a comment** — click the reply button next to any comment and write your response
4. **Observe synchronization** — switch between servers to see how events propagate with different latencies
5. **Pending events** — watch how replies queue up if their parent comment has not yet arrived

## Key Components

#### `CausalServer`
Class that simulates an individual server with:
- Local event management
- Vector clock for causality tracking
- Pending event queue
- Ordered insertion logic

#### `CausalConsistencyDemo`
Main React component that handles:
- State for all three servers
- User interface
- Cross-server synchronization
- Event rendering

## 🔧 Configuration

### Network Latencies

Latencies between servers are configured in the `syncServers` method:

```javascript
const serverLatencies = [
  3000 + Math.random() * 2000,  // 3–5 seconds
  5000 + Math.random() * 3000,  // 5–8 seconds
  7000 + Math.random() * 3000   // 7–10 seconds
];
```

Replies use a 0.6× latency multiplier to simulate delivery priority.

## 🎨 Customization

### Styles

Styles are centralized in `src/styles.css` using:
- CSS variables for consistent colors
- Responsive design with media queries
- Modern gradients and shadows

### Primary Colors

- Primary blue: `#2563eb`
- Background: light blue gradient
- Text: `#1f2937`

## 📚 Learning

This project is ideal for understanding:
- Distributed systems
- Consistency models
- Vector clocks
- Event propagation
- Causal ordering
- React and state management

## 🤝 Contributing

Contributions are welcome. Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

⭐️ If this project was useful to you, consider giving it a star on GitHub!
