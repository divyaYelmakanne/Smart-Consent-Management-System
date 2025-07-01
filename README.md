# CookieGuard - GDPR Compliant Cookie Consent System

A modern, responsive cookie consent management system similar to CookieYes, built with HTML, CSS, JavaScript, and Node.js.

## 🚀 Features

### Frontend
- **Modern, Responsive Design** - Beautiful UI that works on all devices
- **Interactive Cookie Banner** - Customizable consent banner with smooth animations
- **Preferences Modal** - Detailed cookie category management
- **Real-time Dashboard** - Live statistics and analytics visualization
- **GDPR Compliant** - Full compliance with privacy regulations
- **Customizable Styling** - Easy to match your brand colors and fonts

### Backend
- **RESTful API** - Complete API for consent management
- **Analytics Tracking** - Track user interactions and consent patterns
- **Marketing Integration** - Support for marketing cookie tracking
- **Data Retention** - Configurable data retention policies
- **Rate Limiting** - Protection against abuse
- **Security Headers** - Built-in security with Helmet.js

## 📁 Project Structure

```
CONSET/
├── Frontend/
│   ├── index.html          # Main landing page
│   ├── dashboard.html      # Analytics dashboard
│   ├── styles.css          # Main stylesheet
│   ├── dashboard.css       # Dashboard-specific styles
│   ├── script.js           # Main JavaScript functionality
│   └── dashboard.js        # Dashboard JavaScript
├── Backend/
│   ├── server.js           # Express server
│   ├── package.json        # Node.js dependencies
│   └── config.env          # Environment configuration
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A modern web browser

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd Backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

The backend will start on `http://localhost:3000`

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd Frontend
   ```

2. **Serve the frontend files:**
   
   You can use any static file server. Here are a few options:

   **Using Python (if installed):**
   ```bash
   # Python 3
   python -m http.server 5500
   
   # Python 2
   python -m SimpleHTTPServer 5500
   ```

   **Using Node.js (if you have http-server installed):**
   ```bash
   npx http-server -p 5500
   ```

   **Using Live Server (VS Code extension):**
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

3. **Open your browser and navigate to:**
   ```
   http://localhost:5500
   ```

## 🎯 Usage

### Main Page (`index.html`)
- **Demo Widget**: Interactive cookie consent widget on the right side
- **Demo Controls**: Buttons to test different consent scenarios
- **Cookie Banner**: Appears at the bottom of the page
- **Preferences Modal**: Detailed cookie management interface

### Dashboard (`dashboard.html`)
- **Overview Statistics**: Real-time consent and analytics data
- **Interactive Charts**: Visual representation of consent patterns
- **Data Tables**: Detailed records of consent and analytics events
- **Pagination**: Navigate through large datasets

### API Endpoints

#### Consent Management
- `POST /api/consent` - Save user consent preferences
- `GET /api/consent` - Retrieve consent records

#### Analytics
- `POST /api/analytics` - Record analytics events
- `GET /api/analytics` - Retrieve analytics data

#### Marketing
- `POST /api/marketing` - Record marketing events
- `GET /api/marketing` - Retrieve marketing data

#### Statistics
- `GET /api/stats` - Get dashboard statistics

#### Health Check
- `GET /health` - Server health status

## 🎨 Customization

### Styling
The system is fully customizable through CSS variables and classes:

1. **Colors**: Modify the color scheme in `styles.css`
2. **Fonts**: Change fonts by updating the Google Fonts import
3. **Layout**: Adjust spacing and layout in the CSS files
4. **Animations**: Customize transitions and animations

### Configuration
Backend configuration can be modified in `Backend/config.env`:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5500
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔒 Privacy & Compliance

### GDPR Compliance
- **Explicit Consent**: Users must actively choose their preferences
- **Granular Control**: Separate toggles for different cookie categories
- **Easy Withdrawal**: Users can change preferences at any time
- **Data Transparency**: Clear information about what data is collected
- **Data Retention**: Configurable retention periods

### Cookie Categories
1. **Essential Cookies**: Always enabled, necessary for website functionality
2. **Analytics Cookies**: Track user behavior and website performance
3. **Marketing Cookies**: Used for personalized advertising

## 📊 Dashboard Features

### Real-time Statistics
- Total consent records
- 24-hour consent activity
- Analytics event counts
- Marketing event counts

### Visual Analytics
- **Consent Breakdown Chart**: Doughnut chart showing consent patterns
- **Activity Timeline**: Line chart showing activity over time
- **Interactive Tables**: Paginated data tables with sorting

### Data Management
- **Pagination**: Handle large datasets efficiently
- **Search & Filter**: Find specific records quickly
- **Export**: Download data for analysis (future feature)

## 🚀 Deployment

### Backend Deployment
1. Set up a Node.js hosting environment (Heroku, Vercel, AWS, etc.)
2. Configure environment variables
3. Deploy the Backend folder
4. Update CORS settings for your domain

### Frontend Deployment
1. Upload Frontend files to your web server
2. Update API endpoints to point to your backend
3. Configure your domain and SSL certificate

## 🔧 Development

### Adding New Features
1. **Frontend**: Add new components in the Frontend directory
2. **Backend**: Create new API endpoints in `server.js`
3. **Styling**: Add CSS classes in the appropriate stylesheet
4. **Testing**: Test thoroughly across different browsers and devices

### Database Integration
For production use, consider integrating a database:
- **MongoDB**: For document-based storage
- **PostgreSQL**: For relational data
- **Redis**: For caching and session storage

## 📝 API Documentation

### Consent Object Structure
```json
{
  "consent": {
    "essential": true,
    "analytics": false,
    "marketing": false
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

### Response Format
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the browser console for JavaScript errors
2. Verify the backend server is running
3. Check network connectivity between frontend and backend
4. Review the API documentation above

## 🎉 Demo

Visit the main page to see the cookie consent system in action:
- Interactive demo widget
- Cookie banner functionality
- Preferences modal
- Dashboard with real-time data

The system is designed to be production-ready and can be easily integrated into any website! 