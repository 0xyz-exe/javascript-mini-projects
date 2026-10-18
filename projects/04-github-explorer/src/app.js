import { GitHubAPI } from './GitHubAPI.js';

class GitHubApp {
  constructor() {
    this.api = new GitHubAPI();
    this.currentUser = null;

    this.elements = {
      searchInput: document.getElementById('searchInput'),
      searchBtn: document.getElementById('searchBtn'),
      loading: document.getElementById('loading'),
      error: document.getElementById('error'),
      userProfile: document.getElementById('userProfile'),
      reposList: document.getElementById('reposList')
    };

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.elements.searchBtn.addEventListener('click', () => this.searchUser());
    this.elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchUser();
    });
  }

  async searchUser() {
    const username = this.elements.searchInput.value.trim();
    
    if (!username) {
      this.showError('Please enter a username');
      return;
    }

    this.showLoading();

    try {
      const user = await this.api.fetchUser(username);
      this.currentUser = user;
      
      const repos = await this.api.fetchUserRepos(username);
      
      this.renderUser(user);
      this.renderRepos(repos);
    } catch (err) {
      this.showError(err.message);
    }
  }

  showLoading() {
    this.elements.loading.style.display = 'block';
    this.elements.error.style.display = 'none';
    this.elements.userProfile.style.display = 'none';
    this.elements.reposList.style.display = 'none';
  }

  showError(message) {
    this.elements.loading.style.display = 'none';
    this.elements.error.style.display = 'block';
    this.elements.error.textContent = `Error: ${message}`;
    this.elements.userProfile.style.display = 'none';
    this.elements.reposList.style.display = 'none';
  }

  renderUser(user) {
    this.elements.loading.style.display = 'none';
    this.elements.error.style.display = 'none';
    this.elements.userProfile.style.display = 'block';

    this.elements.userProfile.innerHTML = `
      <div class="profile-header">
        <img src="${user.avatar_url}" alt="${user.login}" class="avatar" />
        <div class="profile-info">
          <h2>${user.name || user.login}</h2>
          <p class="username">@${user.login}</p>
          ${user.bio ? `<p class="bio">${this.escapeHtml(user.bio)}</p>` : ''}
          <div class="profile-links">
            ${user.blog ? `<a href="${user.blog}" target="_blank" rel="noopener">🔗 Website</a>` : ''}
            <a href="${user.html_url}" target="_blank" rel="noopener">View on GitHub</a>
          </div>
        </div>
      </div>
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-value">${this.api.formatNumber(user.public_repos)}</span>
          <span class="stat-label">Repositories</span>
        </div>
        <div class="stat">
          <span class="stat-value">${this.api.formatNumber(user.followers)}</span>
          <span class="stat-label">Followers</span>
        </div>
        <div class="stat">
          <span class="stat-value">${this.api.formatNumber(user.following)}</span>
          <span class="stat-label">Following</span>
        </div>
      </div>
    `;
  }

  renderRepos(repos) {
    this.elements.reposList.style.display = 'block';

    if (repos.length === 0) {
      this.elements.reposList.innerHTML = '<p class="empty">No public repositories</p>';
      return;
    }

    const reposHTML = repos.map(repo => `
      <div class="repo-item" data-owner="${repo.owner.login}" data-repo="${repo.name}">
        <div class="repo-header">
          <h3 class="repo-name">${this.escapeHtml(repo.name)}</h3>
          ${repo.private ? '<span class="badge">Private</span>' : ''}
        </div>
        ${repo.description ? `<p class="repo-desc">${this.escapeHtml(repo.description)}</p>` : ''}
        <div class="repo-meta">
          ${repo.language ? `<span class="language">${repo.language}</span>` : ''}
          <span class="stars">⭐ ${this.api.formatNumber(repo.stargazers_count)}</span>
          <span class="forks">🍴 ${this.api.formatNumber(repo.forks_count)}</span>
          <span class="updated">Updated ${this.formatDate(repo.updated_at)}</span>
        </div>
        <div class="repo-links">
          <a href="${repo.html_url}" target="_blank" rel="noopener">View Repository</a>
        </div>
      </div>
    `).join('');

    this.elements.reposList.innerHTML = `
      <h2>Repositories (${repos.length})</h2>
      ${reposHTML}
    `;
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

new GitHubApp();
