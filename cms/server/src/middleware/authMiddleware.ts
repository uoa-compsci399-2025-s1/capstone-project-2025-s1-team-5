// import jwt from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

// export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: 'Missing token' });

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
//         if (err) return res.status(403).json({ message: 'Invalid token' });

//         req.user = user; // Attach decoded payload
//         next();
//     });
// }

// export function authorizeStaff(req: Request, res: Response, next: NextFunction) {
//     if (req.user?.role !== 'staff') return res.status(403).json({ message: 'Staff only' });
//     next();
// }
