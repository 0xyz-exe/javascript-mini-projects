const examples = {
  arrays: `// Array methods
const numbers = [1, 2, 3, 4, 5];

const doubled = numbers.map(n => n * 2);
console.log('Doubled:', doubled);

const evens = numbers.filter(n => n % 2 === 0);
console.log('Evens:', evens);

const sum = numbers.reduce((acc, n) => acc + n, 0);
console.log('Sum:', sum);`,

  objects: `// Object operations
const person = {
  name: 'Alice',
  age: 30,
  city: 'NYC'
};

console.log('Person:', person);

const { name, age } = person;
console.log(\`\${name} is \${age} years old\`);

const updated = { ...person, age: 31 };
console.log('Updated:', updated);`,

  promises: `// Promise example
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

console.log('Start');

delay(1000).then(() => {
  console.log('After 1 second');
  return delay(1000);
}).then(() => {
  console.log('After 2 seconds');
});`,

  classes: `// ES6 Classes
class Animal {
  constructor(name) {
    this.name = name;
  }
  
  speak() {
    console.log(\`\${this.name} makes a sound\`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(\`\${this.name} barks\`);
  }
}

const dog = new Dog('Rex');
dog.speak();`,

  destructuring: `// Destructuring
const arr = [1, 2, 3, 4, 5];
const [first, second, ...rest] = arr;
console.log('First:', first);
console.log('Rest:', rest);

const user = {
  id: 1,
  profile: {
    username: 'alice',
    email: 'alice@example.com'
  }
};

const { profile: { username, email } } = user;
console.log('Username:', username);
console.log('Email:', email);`,

  async: `// Async/Await
async function fetchData() {
  console.log('Fetching data...');
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.log('Data received!');
  return { id: 1, value: 'Sample data' };
}

fetchData().then(data => {
  console.log('Result:', data);
});`
};

class Playground {
  constructor() {
    this.codeEditor = document.getElementById('codeEditor');
    this.output = document.getElementById('output');
    this.runBtn = document.getElementById('runBtn');
    this.resetBtn = document.getElementById('resetBtn');
    this.clearBtn = document.getElementById('clearBtn');
    this.exampleBtns = document.querySelectorAll('.example-btn');
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.runBtn.addEventListener('click', () => this.runCode());
    this.resetBtn.addEventListener('click', () => this.reset());
    this.clearBtn.addEventListener('click', () => this.clearOutput());
    
    this.exampleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const example = e.target.dataset.example;
        this.loadExample(example);
      });
    });
    
    // Keyboard shortcuts
    this.codeEditor.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
    });
  }

  loadExample(name) {
    if (examples[name]) {
      this.codeEditor.value = examples[name];
      this.clearOutput();
    }
  }

  clearOutput() {
    this.output.innerHTML = '';
  }

  log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.textContent = message;
    this.output.appendChild(entry);
    this.output.scrollTop = this.output.scrollHeight;
  }

  runCode() {
    this.clearOutput();
    
    const code = this.codeEditor.value.trim();
    if (!code) {
      this.log('No code to execute', 'warn');
      return;
    }

    try {
      // Create sandboxed iframe
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.sandbox = 'allow-scripts';
      document.body.appendChild(iframe);

      const iframeWin = iframe.contentWindow;
      
      // Capture console output
      const logs = [];
      iframeWin.console = {
        log: (...args) => logs.push({ type: 'info', args }),
        error: (...args) => logs.push({ type: 'error', args }),
        warn: (...args) => logs.push({ type: 'warn', args })
      };

      // Execute with timeout
      const timeout = setTimeout(() => {
        iframe.remove();
        this.log('Execution timeout (5s)', 'error');
      }, 5000);

      try {
        // Execute code in iframe
        iframeWin.eval(code);
        
        // Process logs after execution
        setTimeout(() => {
          clearTimeout(timeout);
          
          if (logs.length === 0) {
            this.log('Code executed (no output)', 'info');
          } else {
            logs.forEach(({ type, args }) => {
              const message = args.map(arg => {
                if (typeof arg === 'object') {
                  return JSON.stringify(arg, null, 2);
                }
                return String(arg);
              }).join(' ');
              this.log(message, type);
            });
          }
          
          iframe.remove();
        }, 100);
        
      } catch (err) {
        clearTimeout(timeout);
        this.log(`Error: ${err.message}`, 'error');
        iframe.remove();
      }
      
    } catch (err) {
      this.log(`Execution failed: ${err.message}`, 'error');
    }
  }

  reset() {
    this.codeEditor.value = `// Write your JavaScript code here
console.log('Hello, JavaScript Playground!');

const sum = (a, b) => a + b;
console.log('Sum:', sum(5, 3));`;
    this.clearOutput();
  }
}

// Initialize playground
new Playground();
