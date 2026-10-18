class NotesApp {
  constructor() {
    this.notes = [];
    this.currentNote = null;
    
    this.elements = {
      newNoteBtn: document.getElementById('newNoteBtn'),
      searchInput: document.getElementById('searchInput'),
      notesList: document.getElementById('notesList'),
      editorContent: document.getElementById('editorContent'),
      previewContent: document.getElementById('previewContent')
    };

    this.loadNotes();
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    this.elements.newNoteBtn.addEventListener('click', () => this.createNote());
    this.elements.searchInput.addEventListener('input', () => this.render());

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        this.createNote();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        this.elements.searchInput.focus();
      }
    });
  }

  createNote() {
    const note = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.notes.unshift(note);
    this.currentNote = note;
    this.saveNotes();
    this.render();
  }

  deleteNote(id) {
    if (confirm('Delete this note?')) {
      this.notes = this.notes.filter(n => n.id !== id);
      if (this.currentNote && this.currentNote.id === id) {
        this.currentNote = null;
      }
      this.saveNotes();
      this.render();
    }
  }

  selectNote(id) {
    this.currentNote = this.notes.find(n => n.id === id);
    this.render();
  }

  updateNote(updates) {
    if (!this.currentNote) return;

    Object.assign(this.currentNote, updates);
    this.currentNote.updatedAt = new Date().toISOString();
    this.saveNotes();
    this.renderPreview();
  }

  render() {
    this.renderNotesList();
    this.renderEditor();
    this.renderPreview();
  }

  renderNotesList() {
    const search = this.elements.searchInput.value.toLowerCase();
    const filtered = this.notes.filter(n => 
      n.title.toLowerCase().includes(search) ||
      n.content.toLowerCase().includes(search) ||
      n.tags.some(t => t.toLowerCase().includes(search))
    );

    if (filtered.length === 0) {
      this.elements.notesList.innerHTML = '<div class="empty">No notes</div>';
      return;
    }

    this.elements.notesList.innerHTML = filtered.map(note => `
      <div class="note-item ${this.currentNote && this.currentNote.id === note.id ? 'active' : ''}" data-id="${note.id}">
        <div class="note-title">${this.escapeHtml(note.title)}</div>
        <div class="note-date">${new Date(note.updatedAt).toLocaleDateString()}</div>
      </div>
    `).join('');

    this.elements.notesList.querySelectorAll('.note-item').forEach(el => {
      el.addEventListener('click', () => this.selectNote(el.dataset.id));
    });
  }

  renderEditor() {
    if (!this.currentNote) {
      this.elements.editorContent.innerHTML = '<div class="empty">Select a note or create a new one</div>';
      return;
    }

    this.elements.editorContent.innerHTML = `
      <div class="note-meta">
        <input type="text" id="noteTitle" value="${this.escapeHtml(this.currentNote.title)}" placeholder="Note title" />
        <input type="text" id="noteTags" value="${this.currentNote.tags.join(', ')}" placeholder="Tags (comma-separated)" />
      </div>
      <div class="actions">
        <button id="deleteBtn" class="btn-small">Delete</button>
      </div>
      <textarea id="noteContent" placeholder="Write in Markdown...">${this.escapeHtml(this.currentNote.content)}</textarea>
    `;

    const titleInput = document.getElementById('noteTitle');
    const tagsInput = document.getElementById('noteTags');
    const contentArea = document.getElementById('noteContent');
    const deleteBtn = document.getElementById('deleteBtn');

    titleInput.addEventListener('input', () => {
      this.updateNote({ title: titleInput.value || 'Untitled Note' });
      this.renderNotesList();
    });

    tagsInput.addEventListener('input', () => {
      const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean);
      this.updateNote({ tags });
    });

    contentArea.addEventListener('input', () => {
      this.updateNote({ content: contentArea.value });
    });

    deleteBtn.addEventListener('click', () => this.deleteNote(this.currentNote.id));
  }

  renderPreview() {
    if (!this.currentNote) {
      this.elements.previewContent.innerHTML = '<div class="empty">Preview</div>';
      return;
    }

    this.elements.previewContent.innerHTML = this.parseMarkdown(this.currentNote.content);
  }

  parseMarkdown(md) {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold/Italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/```([^`]+)```/g, '<pre>$1</pre>');

    // Lists
    html = html.replace(/^\* (.+)$/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Blockquotes
    html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');

    // Paragraphs
    html = html.split('\n\n').map(p => {
      if (!p.match(/^<(h|ul|pre|blockquote)/)) {
        return '<p>' + p + '</p>';
      }
      return p;
    }).join('\n');

    return html;
  }

  saveNotes() {
    try {
      localStorage.setItem('markdownNotes', JSON.stringify(this.notes));
    } catch (err) {
      console.warn('Save failed:', err);
    }
  }

  loadNotes() {
    try {
      const data = localStorage.getItem('markdownNotes');
      if (data) {
        this.notes = JSON.parse(data);
      }
    } catch (err) {
      console.warn('Load failed:', err);
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new NotesApp();
