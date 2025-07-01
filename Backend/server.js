const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage (in production, use a database)
const consentData = [];
const analyticsData = [];
const marketingData = [];

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// API Routes

// Consent Management
app.post('/api/consent', (req, res) => {
    try {
        const { consent, timestamp, userAgent } = req.body;
        
        if (!consent) {
            return res.status(400).json({
                success: false,
                message: 'Consent data is required'
            });
        }

        const consentRecord = {
            id: uuidv4(),
            consent,
            timestamp: timestamp || new Date().toISOString(),
            userAgent: userAgent || req.get('User-Agent'),
            ip: req.ip,
            sessionId: req.session?.id || 'anonymous'
        };

        consentData.push(consentRecord);

        // Keep only last 1000 records
        if (consentData.length > 1000) {
            consentData.shift();
        }

        console.log('Consent saved:', consentRecord);

        res.json({
            success: true,
            message: 'Consent saved successfully',
            data: {
                id: consentRecord.id,
                timestamp: consentRecord.timestamp
            }
        });
    } catch (error) {
        console.error('Error saving consent:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/api/consent', (req, res) => {
    try {
        const { limit = 50, offset = 0 } = req.query;
        
        const limitedData = consentData
            .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
            .map(record => ({
                id: record.id,
                consent: record.consent,
                timestamp: record.timestamp,
                userAgent: record.userAgent
            }));

        res.json({
            success: true,
            data: limitedData,
            total: consentData.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching consent data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Analytics Tracking
app.post('/api/analytics', (req, res) => {
    try {
        const { type, timestamp, url, userAgent, ...otherData } = req.body;
        
        if (!type) {
            return res.status(400).json({
                success: false,
                message: 'Event type is required'
            });
        }

        const analyticsRecord = {
            id: uuidv4(),
            type,
            timestamp: timestamp || new Date().toISOString(),
            url: url || req.get('Referer'),
            userAgent: userAgent || req.get('User-Agent'),
            ip: req.ip,
            sessionId: req.session?.id || 'anonymous',
            ...otherData
        };

        analyticsData.push(analyticsRecord);

        // Keep only last 5000 records
        if (analyticsData.length > 5000) {
            analyticsData.shift();
        }

        console.log('Analytics event:', analyticsRecord);

        res.json({
            success: true,
            message: 'Analytics event recorded',
            data: {
                id: analyticsRecord.id,
                timestamp: analyticsRecord.timestamp
            }
        });
    } catch (error) {
        console.error('Error recording analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/api/analytics', (req, res) => {
    try {
        const { limit = 100, offset = 0, type } = req.query;
        
        let filteredData = analyticsData;
        
        if (type) {
            filteredData = analyticsData.filter(record => record.type === type);
        }

        const limitedData = filteredData
            .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
            .map(record => ({
                id: record.id,
                type: record.type,
                timestamp: record.timestamp,
                url: record.url,
                userAgent: record.userAgent
            }));

        res.json({
            success: true,
            data: limitedData,
            total: filteredData.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Marketing Tracking
app.post('/api/marketing', (req, res) => {
    try {
        const { type, timestamp, action, userAgent, ...otherData } = req.body;
        
        if (!type || !action) {
            return res.status(400).json({
                success: false,
                message: 'Event type and action are required'
            });
        }

        const marketingRecord = {
            id: uuidv4(),
            type,
            action,
            timestamp: timestamp || new Date().toISOString(),
            userAgent: userAgent || req.get('User-Agent'),
            ip: req.ip,
            sessionId: req.session?.id || 'anonymous',
            ...otherData
        };

        marketingData.push(marketingRecord);

        // Keep only last 2000 records
        if (marketingData.length > 2000) {
            marketingData.shift();
        }

        console.log('Marketing event:', marketingRecord);

        res.json({
            success: true,
            message: 'Marketing event recorded',
            data: {
                id: marketingRecord.id,
                timestamp: marketingRecord.timestamp
            }
        });
    } catch (error) {
        console.error('Error recording marketing event:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

app.get('/api/marketing', (req, res) => {
    try {
        const { limit = 50, offset = 0, type, action } = req.query;
        
        let filteredData = marketingData;
        
        if (type) {
            filteredData = filteredData.filter(record => record.type === type);
        }
        
        if (action) {
            filteredData = filteredData.filter(record => record.action === action);
        }

        const limitedData = filteredData
            .slice(parseInt(offset), parseInt(offset) + parseInt(limit))
            .map(record => ({
                id: record.id,
                type: record.type,
                action: record.action,
                timestamp: record.timestamp,
                userAgent: record.userAgent
            }));

        res.json({
            success: true,
            data: limitedData,
            total: filteredData.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error fetching marketing data:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Dashboard Statistics
app.get('/api/stats', (req, res) => {
    try {
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Consent statistics
        const totalConsents = consentData.length;
        const consents24h = consentData.filter(record => 
            new Date(record.timestamp) > last24h
        ).length;
        const consents7d = consentData.filter(record => 
            new Date(record.timestamp) > last7d
        ).length;

        // Analytics statistics
        const totalAnalytics = analyticsData.length;
        const analytics24h = analyticsData.filter(record => 
            new Date(record.timestamp) > last24h
        ).length;

        // Marketing statistics
        const totalMarketing = marketingData.length;
        const marketing24h = marketingData.filter(record => 
            new Date(record.timestamp) > last24h
        ).length;

        // Consent breakdown
        const consentBreakdown = {
            allAccepted: consentData.filter(record => 
                record.consent.analytics && record.consent.marketing
            ).length,
            partialAccepted: consentData.filter(record => 
                (record.consent.analytics || record.consent.marketing) && 
                !(record.consent.analytics && record.consent.marketing)
            ).length,
            essentialOnly: consentData.filter(record => 
                !record.consent.analytics && !record.consent.marketing
            ).length
        };

        res.json({
            success: true,
            data: {
                consents: {
                    total: totalConsents,
                    last24h: consents24h,
                    last7d: consents7d,
                    breakdown: consentBreakdown
                },
                analytics: {
                    total: totalAnalytics,
                    last24h: analytics24h
                },
                marketing: {
                    total: totalMarketing,
                    last24h: marketing24h
                },
                timestamp: now.toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Cookie Consent API server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📈 Dashboard stats: http://localhost:${PORT}/api/stats`);
    console.log(`🍪 Consent endpoint: http://localhost:${PORT}/api/consent`);
    console.log(`📊 Analytics endpoint: http://localhost:${PORT}/api/analytics`);
    console.log(`📢 Marketing endpoint: http://localhost:${PORT}/api/marketing`);
});

module.exports = app; 