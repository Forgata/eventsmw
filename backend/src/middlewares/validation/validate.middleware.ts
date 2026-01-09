import type { Request, Response, NextFunction } from "express";
import { ZodError, type ZodType } from "zod";
import { BadRequestError } from "../../errors/controller/errors.js";

export function validate<S extends ZodType<any, any, any>>(schema: S) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      type ParsedType = typeof parsed;
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query) {
        (req as unknown as Request<any, any, any, ParsedType["query"]>).query =
          parsed.query;
      }
      if (parsed.params) {
        (req as unknown as Request<ParsedType["params"]>).params =
          parsed.params;
      }

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    }
  };
}
