const express = require('express');
const path = require('path');
const fs = require('fs');

// Create Express app
const app = express();

// Create a simplified landing page that demonstrates our app
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>IoT Light Settings App</title>
      <style>
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
        .app-preview {
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
      </style>
    </head>
    <body>
      <header>
        <h1>IoT Light Settings App</h1>
        <p>Personalized Lighting Recommendations for Your Smart Home</p>
      </header>
      
      <div class="container">
        <div class="app-preview">
          <h2>Login</h2>
          <form>
            <div>
              <label for="userId">User ID:</label>
              <input type="text" id="userId" placeholder="Enter your user ID" style="padding: 8px; width: 100%; margin: 10px 0;">
            </div>
            <button type="button" class="btn">Login</button>
          </form>
          
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
          
          <button class="btn">Get Recommendations</button>
          
          <div class="settings-display">
            <h3>Current Settings:</h3>
            <p>Brightness: 70%</p>
            <p>Color Temperature: 4000K</p>
            <p>Dimmer Rate: 50%</p>
          </div>
        </div>
        
        <div class="feature">
          <h2>About This App</h2>
          <p>This React Native application provides personalized IoT light settings recommendations based on user preferences. Using AWS Personalize for intelligent suggestions, the app helps users find the perfect lighting atmosphere for any situation.</p>
        </div>
      </div>

      <script>
        // Simple demo functionality for sliders
        document.querySelectorAll('.slider').forEach(slider => {
          slider.addEventListener('input', function() {
            document.getElementById(this.id + '-value').textContent = this.value;
          });
        });
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
  console.log('Proxy server is running on port 5000');
  console.log('The app should be available at http://localhost:5000/');
});