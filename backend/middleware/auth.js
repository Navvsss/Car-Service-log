const User = require('../models/User');

module.exports = async (req, res, next) => {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
        return res.status(401).send('Authentication required.');
    }

    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    try {
        const user = await User.findOne({ email });
        
        if (user && user.password === password && user.isAdmin) {
            req.user = user;
            return next();
        }
        
        res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
        return res.status(401).send('Authentication required.');
    } catch (error) {
        res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
        return res.status(500).send('Authentication error.');
    }
};