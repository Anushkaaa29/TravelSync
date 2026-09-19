import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Defining what the decoded user data looks like
interface DecodedToken {
  id: string;
  role: string;
  name:string,
}

// Extending the standard Request interface
interface AuthRequest extends Request {
  user?: DecodedToken;
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "secret",
      ) as DecodedToken;

      req.user = decoded;
return next();
      next();
    }catch (error: any) {
  console.log(error);

  res.status(401).json({
    message: "Not authorized, token failed",
    error: error.message,
  });
}
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only" });
  }
};
