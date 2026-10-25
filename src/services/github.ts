import { GitHubRepo } from '../types';

export const MOCK_REPOS_BY_USERNAME: Record<string, GitHubRepo[]> = {
  alexchen: [
    {
      id: 101,
      name: 'buckeye-rover-vision',
      full_name: 'alexchen/buckeye-rover-vision',
      description: 'Real-time stereoscopic obstacle detection and semantic segmentation pipeline for planetary rover prototypes.',
      html_url: 'https://github.com/alexchen/buckeye-rover-vision',
      stargazers_count: 84,
      language: 'Python',
      updated_at: '2026-10-18T14:22:00Z',
      forks_count: 14,
    },
    {
      id: 102,
      name: 'distributed-sim-node',
      full_name: 'alexchen/distributed-sim-node',
      description: 'High-throughput ROS2 simulation bridge for multi-agent autonomous vehicle testbeds.',
      html_url: 'https://github.com/alexchen/distributed-sim-node',
      stargazers_count: 42,
      language: 'C++',
      updated_at: '2026-10-10T09:15:00Z',
      forks_count: 7,
    },
    {
      id: 103,
      name: 'campus-craft-ui',
      full_name: 'alexchen/campus-craft-ui',
      description: 'Accessible React design components tailored for academic research dashboards.',
      html_url: 'https://github.com/alexchen/campus-craft-ui',
      stargazers_count: 29,
      language: 'TypeScript',
      updated_at: '2026-09-28T18:40:00Z',
      forks_count: 3,
    },
  ],
  default: [
    {
      id: 201,
      name: 'student-lab-toolkit',
      full_name: 'student/student-lab-toolkit',
      description: 'Interactive computational notebooks and data processing tools for university STEM courses.',
      html_url: 'https://github.com/student/student-lab-toolkit',
      stargazers_count: 38,
      language: 'TypeScript',
      updated_at: '2026-10-21T11:00:00Z',
      forks_count: 5,
    },
    {
      id: 202,
      name: 'embedded-telemetry-firmware',
      full_name: 'student/embedded-telemetry-firmware',
      description: 'Ultra-low latency telemetry logger for ESP32 and ARM Cortex-M4 flight controllers.',
      html_url: 'https://github.com/student/embedded-telemetry-firmware',
      stargazers_count: 67,
      language: 'Rust',
      updated_at: '2026-10-12T16:30:00Z',
      forks_count: 12,
    },
    {
      id: 203,
      name: 'graph-query-visualizer',
      full_name: 'student/graph-query-visualizer',
      description: 'WebGL-accelerated graph relation visualization engine for biomedical ontologies.',
      html_url: 'https://github.com/student/graph-query-visualizer',
      stargazers_count: 112,
      language: 'TypeScript',
      updated_at: '2026-09-30T20:10:00Z',
      forks_count: 19,
    },
  ],
};

export async function fetchUserRepos(username: string): Promise<{ repos: GitHubRepo[]; source: 'api' | 'mock'; error?: string }> {
  const cleanUser = username.trim().replace(/^@/, '');
  if (!cleanUser) {
    return { repos: [], source: 'mock', error: 'Please enter a valid GitHub username.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=15`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const parsedRepos: GitHubRepo[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          full_name: item.full_name || `${cleanUser}/${item.name}`,
          description: item.description || 'Public GitHub repository repository code.',
          html_url: item.html_url,
          stargazers_count: item.stargazers_count || 0,
          language: item.language || 'Code',
          updated_at: item.updated_at || new Date().toISOString(),
          forks_count: item.forks_count || 0,
        }));
        return { repos: parsedRepos, source: 'api' };
      }
    }

    // Rate limited (403), user not found (404), or empty
    console.warn(`GitHub API response not ok (${response.status}). Falling back to mock repos.`);
  } catch (err) {
    console.warn('GitHub API request failed or timed out. Falling back to mock repos.', err);
  }

  // Fallback to mock repositories customized with their username
  const known = MOCK_REPOS_BY_USERNAME[cleanUser.toLowerCase()];
  if (known) {
    return { repos: known, source: 'mock' };
  }

  const generatedMock: GitHubRepo[] = [
    {
      id: Date.now() + 1,
      name: `${cleanUser}-collaborative-workspace`,
      full_name: `${cleanUser}/${cleanUser}-collaborative-workspace`,
      description: `Lightweight real-time collaborative workspace and state sync utilities built by @${cleanUser}.`,
      html_url: `https://github.com/${cleanUser}/${cleanUser}-collaborative-workspace`,
      stargazers_count: 53,
      language: 'TypeScript',
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      forks_count: 8,
    },
    {
      id: Date.now() + 2,
      name: `${cleanUser}-data-pipeline`,
      full_name: `${cleanUser}/${cleanUser}-data-pipeline`,
      description: 'Automated data extraction and normalization engine for academic benchmarks.',
      html_url: `https://github.com/${cleanUser}/${cleanUser}-data-pipeline`,
      stargazers_count: 31,
      language: 'Python',
      updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
      forks_count: 4,
    },
    {
      id: Date.now() + 3,
      name: `${cleanUser}-portfolio-next`,
      full_name: `${cleanUser}/${cleanUser}-portfolio-next`,
      description: 'Interactive developer portfolio highlighting research papers, projects, and design systems.',
      html_url: `https://github.com/${cleanUser}/${cleanUser}-portfolio-next`,
      stargazers_count: 19,
      language: 'TypeScript',
      updated_at: new Date(Date.now() - 86400000 * 14).toISOString(),
      forks_count: 2,
    },
  ];

  return { repos: generatedMock, source: 'mock' };
}
