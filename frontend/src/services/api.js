const API_BASE_URL = 'http://localhost:8000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.detail || `HTTP Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Students
  getStudents: () => request('/students'),
  getStudent: (id) => request(`/students/${id}`),
  getStudentByCode: (code) => request(`/students/code/${code}`),
  getStudentCheckins: (studentId) => request(`/students/${studentId}/checkins`),

  // Checkins & Analysis
  submitCheckIn: (data) => request('/checkins', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getStudentAnalysis: (studentId) => request(`/students/${studentId}/analysis`),
  getStudentRecommendations: (studentId) => request(`/students/${studentId}/recommendations`),

  // Support Requests
  createSupportRequest: (data) => request('/support-requests', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getSupportRequests: (status, priority) => {
    const params = new URLSearchParams();
    if (status && status !== 'All') params.append('status', status);
    if (priority && priority !== 'All') params.append('priority', priority);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/support-requests${queryString}`);
  },
  getSupportRequestDetail: (id) => request(`/support-requests/${id}`),
  updateSupportRequest: (id, data) => request(`/support-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data)
  }),

  // Dashboards
  getStaffDashboard: () => request('/dashboard/staff'),
  getAdminDashboard: () => request('/dashboard/admin'),

  // Machine Learning
  classifyText: (text) => request('/ml/classify-text', {
    method: 'POST',
    body: JSON.stringify({ text })
  }),

  // Resources
  getResources: (category) => request(category ? `/resources?category=${category}` : '/resources'),
  getRecommendedResources: (studentId) => request(`/resources/recommended/${studentId}`),

  // Companion Chat
  sendCompanionMessage: (message, studentId) => request('/chat/companion', {
    method: 'POST',
    body: JSON.stringify({ message, student_id: studentId })
  }),
};
