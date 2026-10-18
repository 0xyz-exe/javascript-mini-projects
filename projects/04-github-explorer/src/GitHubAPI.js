export class GitHubAPI {
  constructor() {
    this.baseURL = 'https://api.github.com';
    this.controller = null;
  }

  async fetchUser(username) {
    if (!username || typeof username !== 'string') {
      throw new Error('Username is required');
    }

    const url = `${this.baseURL}/users/${encodeURIComponent(username)}`;
    
    return this.fetchWithCancel(url);
  }

  async fetchUserRepos(username, page = 1, perPage = 30) {
    const url = `${this.baseURL}/users/${encodeURIComponent(username)}/repos?page=${page}&per_page=${perPage}&sort=updated`;
    
    return this.fetchWithCancel(url);
  }

  async fetchRepo(owner, repo) {
    const url = `${this.baseURL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
    
    return this.fetchWithCancel(url);
  }

  async fetchRepoLanguages(owner, repo) {
    const url = `${this.baseURL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`;
    
    return this.fetchWithCancel(url);
  }

  async fetchWithCancel(url) {
    // Cancel previous request
    if (this.controller) {
      this.controller.abort();
    }

    this.controller = new AbortController();

    try {
      const response = await fetch(url, {
        signal: this.controller.signal,
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Explorer-App'
        }
      });

      // Check rate limit
      const remaining = response.headers.get('X-RateLimit-Remaining');
      if (remaining !== null && parseInt(remaining) < 5) {
        console.warn('Approaching rate limit:', remaining, 'requests remaining');
      }

      if (response.status === 404) {
        throw new Error('User or repository not found');
      }

      if (response.status === 403) {
        throw new Error('Rate limit exceeded. Try again later.');
      }

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      return await response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        throw new Error('Request cancelled');
      }
      throw err;
    }
  }

  processLanguages(languages) {
    const total = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);
    
    return Object.entries(languages)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: ((bytes / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.bytes - a.bytes);
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}
