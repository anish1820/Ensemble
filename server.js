const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();
app.use(express.json());

// Create common CSS styles for all pages
const commonStyles = `
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
    color: #333;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  header {
    background-color: #4a6fa5;
    color: white;
    padding: 20px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .app-box {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
  .feature {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #e9f0f8;
    border-radius: 5px;
  }
  .slider-container {
    margin: 20px 0;
  }
  .slider {
    width: 100%;
  }
  .btn {
    background-color: #4a6fa5;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    margin: 10px 0;
  }
  .btn:hover {
    background-color: #3a5a8c;
  }
  .settings-display {
    padding: 15px;
    background-color: #f0f0f0;
    border-radius: 5px;
    margin-top: 20px;
  }
  .recommendation-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .recommendation-card h3 {
    margin-top: 0;
    color: #4a6fa5;
  }
  .modal {
    display: none;
    position: fixed;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
  }
  .modal-content {
    background-color: white;
    margin: 15% auto;
    padding: 20px;
    border-radius: 8px;
    width: 60%;
    text-align: center;
    animation: slideDown 0.3s ease-out;
  }
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }
  .close:hover {
    color: #333;
  }
  .success-message {
    color: #28a745;
    font-size: 18px;
    margin-bottom: 15px;
  }
  .hidden {
    display: none;
  }
  input[type="text"] {
    padding: 10px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin: 10px 0;
    box-sizing: border-box;
  }
`;

// Login Page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IoT Light Settings - Login</title>
      <style>
        ${commonStyles}
        .login-box {
          max-width: 500px;
          margin: 50px auto;
        }
      </style>
    </head>
    <body>
      <header>
        <h1>IoT Light Settings App</h1>
        <p>Personalized Lighting Recommendations for Your Smart Home</p>
      </header>
      
      <div class="container">
        <div class="app-box login-box">
          <h2>Login</h2>
          <div id="error-message" style="color: red; margin-bottom: 10px;"></div>
          <form id="login-form">
            <div>
              <label for="userId">User ID:</label>
              <input type="text" id="userId" name="userId" placeholder="Enter your user ID" required>
            </div>
            <button type="submit" class="btn">Login</button>
          </form>
        </div>
      </div>

      <script>
        document.getElementById('login-form').addEventListener('submit', function(e) {
          e.preventDefault();
          
          const userId = document.getElementById('userId').value.trim();
          if (!userId) {
            document.getElementById('error-message').textContent = 'Please enter a User ID';
            return;
          }
          
          // Store user ID in localStorage for other pages
          localStorage.setItem('userId', userId);
          
          // Redirect to settings page
          window.location.href = '/settings';
        });
      </script>
    </body>
    </html>
  `);
});

// Settings Page
app.get('/settings', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IoT Light Settings - Current Settings</title>
      <style>
        ${commonStyles}
        .logout {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          text-decoration: none;
        }
        .user-info {
          color: white;
          position: absolute;
          top: 20px;
          left: 20px;
        }
      </style>
    </head>
    <body>
      <header>
        <span class="user-info">User: <span id="current-user">Loading...</span></span>
        <h1>IoT Light Settings</h1>
        <p>Current Settings</p>
        <a href="/" class="logout" id="logout-link">Logout</a>
      </header>
      
      <div class="container">
        <div class="app-box">
          <h2>Light Settings</h2>
          
          <div class="feature">
            <h3>Brightness</h3>
            <div class="slider-container">
              <input type="range" min="0" max="100" value="70" class="slider" id="brightness">
              <p>Value: <span id="brightness-value">70</span>%</p>
            </div>
          </div>
          
          <div class="feature">
            <h3>Color Temperature</h3>
            <div class="slider-container">
              <input type="range" min="2700" max="6500" value="4000" class="slider" id="cct">
              <p>Value: <span id="cct-value">4000</span>K</p>
            </div>
          </div>
          
          <div class="feature">
            <h3>Dimmer Rate</h3>
            <div class="slider-container">
              <input type="range" min="0" max="100" value="50" class="slider" id="dimmer">
              <p>Value: <span id="dimmer-value">50</span>%</p>
            </div>
          </div>
          
          <button class="btn" id="get-recommendations-btn">Get Recommendations</button>
          
          <div class="settings-display">
            <h3>Current Settings:</h3>
            <p>Brightness: <span id="current-brightness">70</span>%</p>
            <p>Color Temperature: <span id="current-cct">4000</span>K</p>
            <p>Dimmer Rate: <span id="current-dimmer">50</span>%</p>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div id="success-modal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p class="success-message">Settings Applied Successfully!</p>
          <p>Your light settings have been updated.</p>
          <button class="btn" id="modal-ok-btn">OK</button>
        </div>
      </div>

      <script>
        // Check if user is logged in
        document.addEventListener('DOMContentLoaded', function() {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            window.location.href = '/';
            return;
          }
          
          document.getElementById('current-user').textContent = userId;
          
          // Set up logout functionality
          document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userId');
            localStorage.removeItem('brightness');
            localStorage.removeItem('cct');
            localStorage.removeItem('dimmer');
            window.location.href = '/';
          });
          
          // Load saved settings from localStorage if they exist
          const savedBrightness = localStorage.getItem('brightness');
          const savedCct = localStorage.getItem('cct');
          const savedDimmer = localStorage.getItem('dimmer');
          
          if (savedBrightness) {
            document.getElementById('brightness').value = savedBrightness;
            document.getElementById('brightness-value').textContent = savedBrightness;
            document.getElementById('current-brightness').textContent = savedBrightness;
          }
          
          if (savedCct) {
            document.getElementById('cct').value = savedCct;
            document.getElementById('cct-value').textContent = savedCct;
            document.getElementById('current-cct').textContent = savedCct;
          }
          
          if (savedDimmer) {
            document.getElementById('dimmer').value = savedDimmer;
            document.getElementById('dimmer-value').textContent = savedDimmer;
            document.getElementById('current-dimmer').textContent = savedDimmer;
          }
          
          // Update current settings display when sliders change
          document.querySelectorAll('.slider').forEach(slider => {
            slider.addEventListener('input', function() {
              const valueElement = document.getElementById(this.id + '-value');
              const currentElement = document.getElementById('current-' + this.id);
              
              valueElement.textContent = this.value;
              currentElement.textContent = this.value;
            });
          });
          
          // Get recommendations button
          document.getElementById('get-recommendations-btn').addEventListener('click', function() {
            const brightness = document.getElementById('brightness').value;
            const cct = document.getElementById('cct').value;
            const dimmer = document.getElementById('dimmer').value;
            
            // Save current settings to localStorage
            localStorage.setItem('brightness', brightness);
            localStorage.setItem('cct', cct);
            localStorage.setItem('dimmer', dimmer);
            
            // Redirect to recommendations page
            window.location.href = '/recommendations';
          });
        });
      </script>
    </body>
    </html>
  `);
});

// Recommendations Page
app.get('/recommendations', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IoT Light Settings - Recommendations</title>
      <style>
        ${commonStyles}
        .logout {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          text-decoration: none;
        }
        .user-info {
          color: white;
          position: absolute;
          top: 20px;
          left: 20px;
        }
        .back-btn {
          margin-bottom: 20px;
        }
        .confidence-bar {
          height: 10px;
          background-color: #e9ecef;
          border-radius: 5px;
          margin-top: 8px;
        }
        .confidence-level {
          height: 100%;
          background-color: #4a6fa5;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <header>
        <span class="user-info">User: <span id="current-user">Loading...</span></span>
        <h1>IoT Light Settings</h1>
        <p>Recommended Settings</p>
        <a href="/" class="logout" id="logout-link">Logout</a>
      </header>
      
      <div class="container">
        <button class="btn back-btn" id="back-btn">← Back to Settings</button>
        
        <div class="app-box">
          <h2>Personalized Recommendations</h2>
          <p>Based on your preferences, we recommend the following lighting settings:</p>
          
          <div id="recommendations-container">
            <div class="recommendation-card">
              <h3>Loading recommendations...</h3>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div id="success-modal" class="modal">
        <div class="modal-content">
          <span class="close">&times;</span>
          <p class="success-message">Settings Applied Successfully!</p>
          <p>Your light settings have been updated to the recommended values.</p>
          <button class="btn" id="modal-ok-btn">OK</button>
        </div>
      </div>

      <script>
        // Check if user is logged in
        document.addEventListener('DOMContentLoaded', function() {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            window.location.href = '/';
            return;
          }
          
          document.getElementById('current-user').textContent = userId;
          
          // Set up logout functionality
          document.getElementById('logout-link').addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('userId');
            localStorage.removeItem('brightness');
            localStorage.removeItem('cct');
            localStorage.removeItem('dimmer');
            window.location.href = '/';
          });
          
          // Back button functionality
          document.getElementById('back-btn').addEventListener('click', function() {
            window.location.href = '/settings';
          });
          
          // Get recommendations from API
          fetchRecommendations(userId);
          
          // Modal functionality
          const modal = document.getElementById('success-modal');
          const closeBtn = document.getElementsByClassName('close')[0];
          const okBtn = document.getElementById('modal-ok-btn');
          
          closeBtn.onclick = function() {
            modal.style.display = 'none';
            window.location.href = '/settings';
          }
          
          okBtn.onclick = function() {
            modal.style.display = 'none';
            window.location.href = '/settings';
          }
          
          window.onclick = function(event) {
            if (event.target == modal) {
              modal.style.display = 'none';
              window.location.href = '/settings';
            }
          }
        });
        
        // Fetch recommendations function
        function fetchRecommendations(userId) {
          fetch(\`/api/recommendations?userId=\${userId}\`)
            .then(response => response.json())
            .then(data => {
              const container = document.getElementById('recommendations-container');
              container.innerHTML = '';
              
              data.recommendations.forEach((rec, index) => {
                const confidencePercent = Math.round(rec.confidence * 100);
                const card = document.createElement('div');
                card.className = 'recommendation-card';
                card.innerHTML = \`
                  <h3>Recommendation #\${index + 1}</h3>
                  <p>Brightness: \${rec.settings.brightness}%</p>
                  <p>Color Temperature: \${rec.settings.colorTemperature}K</p>
                  <p>Dimmer Rate: \${rec.settings.dimmerRate}%</p>
                  <p>Confidence: \${confidencePercent}%</p>
                  <div class="confidence-bar">
                    <div class="confidence-level" style="width: \${confidencePercent}%"></div>
                  </div>
                  <button class="btn apply-btn" data-brightness="\${rec.settings.brightness}" 
                    data-cct="\${rec.settings.colorTemperature}" 
                    data-dimmer="\${rec.settings.dimmerRate}">
                    Apply Settings
                  </button>
                \`;
                container.appendChild(card);
              });
              
              // Add event listeners to apply buttons
              document.querySelectorAll('.apply-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                  const brightness = this.getAttribute('data-brightness');
                  const cct = this.getAttribute('data-cct');
                  const dimmer = this.getAttribute('data-dimmer');
                  
                  // Save settings to localStorage
                  localStorage.setItem('brightness', brightness);
                  localStorage.setItem('cct', cct);
                  localStorage.setItem('dimmer', dimmer);
                  
                  // Show success modal
                  document.getElementById('success-modal').style.display = 'block';
                });
              });
            })
            .catch(error => {
              console.error('Error fetching recommendations:', error);
              document.getElementById('recommendations-container').innerHTML = \`
                <div class="recommendation-card">
                  <h3>Error Loading Recommendations</h3>
                  <p>Sorry, we couldn't load your personalized recommendations at this time.</p>
                </div>
              \`;
            });
        }
      </script>
    </body>
    </html>
  `);
});

// API endpoint to simulate recommendations
app.get('/api/recommendations', (req, res) => {
  // Simulate a recommendation response
  const recommendations = {
    userId: req.query.userId || "user123",
    recommendations: [
      {
        id: "brightness_75_cct_3500_dimmer_60",
        settings: {
          brightness: 75,
          colorTemperature: 3500,
          dimmerRate: 60
        },
        confidence: 0.89
      },
      {
        id: "brightness_80_cct_4000_dimmer_50",
        settings: {
          brightness: 80,
          colorTemperature: 4000,
          dimmerRate: 50
        },
        confidence: 0.76
      },
      {
        id: "brightness_65_cct_3000_dimmer_70",
        settings: {
          brightness: 65,
          colorTemperature: 3000,
          dimmerRate: 70
        },
        confidence: 0.65
      }
    ]
  };
  
  res.json(recommendations);
});

// Start the server
app.listen(5000, '0.0.0.0', () => {
  console.log('Server is running on port 5000');
  console.log('The app should be available at http://localhost:5000/');
});