import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wrapper para manejar funciones async en Express
// Elimina la necesidad de try-catch en cada controller
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Versión para requests autenticados
export const asyncHandlerAuth = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler => {
  return asyncHandler(fn);
};
