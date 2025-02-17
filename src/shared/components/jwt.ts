/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { ITokenProvider, TokenPayload } from '../interface';

// Helper to ensure an unknown error is converted to an Error instance.
function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err));
}

@Injectable()
export class JwtTokenService implements ITokenProvider {
  constructor(
    private readonly secretKey: string,
    private readonly expiresIn: string | number,
  ) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(
        payload,
        this.secretKey,
        { expiresIn: this.expiresIn },
        (err: unknown, token?: string) => {
          if (err) {
            return reject(toError(err)); // Ensures err is a proper Error instance.
          }
          if (!token) {
            return reject(new Error('Token generation failed'));
          }
          resolve(token);
        },
      );
    });
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    return new Promise<TokenPayload | null>(resolve => {
      jwt.verify(token, this.secretKey, (err: unknown, decoded?: unknown) => {
        if (err) {
          return resolve(null);
        }
        resolve(decoded as TokenPayload);
      });
    });
  }
}
