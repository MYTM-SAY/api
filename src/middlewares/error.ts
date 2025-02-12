import { Request, Response, NextFunction } from 'express';

export default (err: any, req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500).json({ message: err.message });
  _next();
};
