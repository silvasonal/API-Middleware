const apiKeyDAO = require('../daos/apiKeyDAO');

const authenticateApiKey = async (req, res, next) => {
    const apiKey = req.header('x-api-key');
    if (!apiKey) {
        return res.status(401).json({ error: 'Access denied, no API key provided' });
    }

    try {
        const apiKeyRecord  = await apiKeyDAO.findApiKey(apiKey);
        if (!apiKeyRecord ) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        req.apiKeyRecord = apiKeyRecord;
        await apiKeyDAO.trackApiKeyUsage(apiKeyRecord.id); // Track usage of the API key
        next();
    }catch (error) {
        console.error('Error authenticating API key:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = authenticateApiKey;