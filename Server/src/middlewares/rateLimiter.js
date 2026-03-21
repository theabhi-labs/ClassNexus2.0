
const requestStore = new Map();

export const rateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100 }) => {
  return (req, res, next) => {
    // Get client IP
    const ip = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const currentTime = Date.now();
    
    // Get or create record for this IP
    let record = requestStore.get(ip);
    
    if (!record) {
      record = {
        count: 1,
        resetTime: currentTime + windowMs
      };
      requestStore.set(ip, record);
      return next();
    }
    
    // Check if window has expired
    if (currentTime > record.resetTime) {
      // Reset counter
      record.count = 1;
      record.resetTime = currentTime + windowMs;
      requestStore.set(ip, record);
      return next();
    }
    
    // Check if limit exceeded
    if (record.count >= max) {
      const resetAfter = Math.ceil((record.resetTime - currentTime) / 1000);
      return res.status(429).json({
        success: false,
        message: `Too many requests. Please try again after ${resetAfter} seconds.`,
        retryAfter: resetAfter
      });
    }
    
    // Increment counter
    record.count++;
    requestStore.set(ip, record);
    next();
  };
};

// Clean up old records every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestStore.entries()) {
    if (now > record.resetTime) {
      requestStore.delete(ip);
    }
  }
}, 60 * 60 * 1000);

export default rateLimiter;