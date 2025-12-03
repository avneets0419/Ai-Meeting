// middleware/auth.js
import jwt from 'jsonwebtoken';
import { PrismaClient } from "@prisma/client";
const prisma =new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req, res, next) {
  // Get token from Authorization header or x-auth-token header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // Also check for token in x-auth-token header (alternative)
  const altToken = req.headers['x-auth-token'];
  
  const finalToken = token || altToken;

  if (!finalToken) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token is required. Please login.' 
    });
  }

  try {
    const decoded = jwt.verify(finalToken, JWT_SECRET);
    req.user = decoded; // { userId: '...', email: '...', etc }
    req.userId = decoded.userId || decoded.id; // Support different token structures
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token. Please login again.' 
    });
  }
}

// Optional: middleware to verify user exists in database
export async function verifyUserExists(req, res, next) {
  try {
    
    
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('User verification error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to verify user' 
    });
  }
}