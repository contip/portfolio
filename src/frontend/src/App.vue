<script setup lang="ts">
import { ref, onMounted } from 'vue'

const apiUrl = '/api'
const cats = ref<any[]>([])
const loading = ref(false)
const error = ref('')

const fetchCats = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await fetch(`${apiUrl}/cats`)
    if (response.ok) {
      cats.value = await response.json()
    } else {
      error.value = `Failed to fetch cats: ${response.status}`
    }
  } catch (e) {
    error.value = `Error: ${e}`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCats()
})
</script>

<template>
  <div class="container">
    <header>
      <h1>Portfolio Dev Environment</h1>
      <p class="subtitle">NestJS API with Vue Frontend on AWS</p>
    </header>

    <main>
      <section class="api-info">
        <h2>API Endpoints</h2>

        <div class="endpoint-card">
          <h3>Cats Controller</h3>
          <div class="endpoint">
            <code>GET /api/cats</code>
            <p>Fetch all cats (public)</p>
          </div>
          <div class="endpoint">
            <code>GET /api/cats/:id</code>
            <p>Get a specific cat by ID</p>
          </div>
          <div class="endpoint">
            <code>POST /api/cats</code>
            <p>Create a new cat (requires authentication)</p>
          </div>
        </div>

        <div class="endpoint-card">
          <h3>Authentication</h3>
          <div class="endpoint">
            <code>GET /api/auth/google</code>
            <p>Initiate Google OAuth login</p>
          </div>
          <div class="endpoint">
            <code>GET /api/auth/google/callback</code>
            <p>Google OAuth callback endpoint</p>
          </div>
          <div class="endpoint">
            <code>GET /api/auth/profile</code>
            <p>Get current user profile (requires authentication)</p>
          </div>
        </div>
      </section>

      <section class="live-test">
        <h2>Live API Test</h2>
        <button @click="fetchCats" :disabled="loading">
          {{ loading ? 'Loading...' : 'Fetch Cats' }}
        </button>

        <div v-if="error" class="error">
          {{ error }}
        </div>

        <div v-if="cats.length > 0" class="results">
          <h3>Results from /api/cats:</h3>
          <pre>{{ JSON.stringify(cats, null, 2) }}</pre>
        </div>
      </section>

      <section class="instructions">
        <h2>Testing Instructions</h2>
        <ol>
          <li>Click "Fetch Cats" to test the public API endpoint</li>
          <li>To test authentication, visit <a href="/api/auth/google">/api/auth/google</a></li>
          <li>After authentication, you can access protected endpoints</li>
          <li>Use tools like curl or Postman to test POST endpoints</li>
        </ol>

        <div class="example">
          <h3>Example: Create a Cat (with auth token)</h3>
          <pre>
curl -X POST https://dev.petertconti.com/api/cats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Fluffy", "age": 3, "breed": "Persian"}'
          </pre>
        </div>
      </section>
    </main>

    <footer>
      <p>Deployed via GitHub Actions to AWS Lambda + CloudFront + S3</p>
      <p>Environment: Development | Region: us-east-1</p>
    </footer>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e0e0e0;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.2rem;
}

h2 {
  color: #34495e;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.api-info {
  margin-bottom: 3rem;
}

.endpoint-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.endpoint-card h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.endpoint {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #dee2e6;
}

.endpoint:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.endpoint code {
  background: #2c3e50;
  color: #fff;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.endpoint p {
  color: #636e72;
  margin: 0;
}

.live-test {
  background: #f0f3f7;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #2980b9;
}

button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.error {
  background: #e74c3c;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.results {
  margin-top: 1.5rem;
}

.results pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.instructions {
  background: white;
  border: 2px solid #ecf0f1;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.instructions ol {
  color: #636e72;
  line-height: 1.8;
}

.example {
  margin-top: 1.5rem;
}

.example pre {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
}

footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
  color: #7f8c8d;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>