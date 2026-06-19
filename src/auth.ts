import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { AUTH_CONFIG } from "@/lib/auth/config";
import {
  loginWithBackend,
  logoutFromBackend,
  refreshAccessToken,
} from "@/lib/auth/backend-auth-api";
import { decodeAccessToken } from "@/lib/auth/token";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
        contextType: {},
        businessId: {},
      },
      authorize: async (credentials) => {
        const username = String(credentials?.username ?? "");
        const password = String(credentials?.password ?? "");
        const contextType = String(credentials?.contextType ?? "");
        const businessId = String(credentials?.businessId ?? "");

        if (!username || !password) {
          throw new Error("Username and password are required");
        }

        const tokens = await loginWithBackend({
          username,
          password,
          contextType: contextType || undefined,
          businessId: businessId || undefined,
        });

        return {
          id: tokens.accessToken,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          accessTokenExpiresAt: Date.now() + tokens.expiresIn * 1000,
          claims: decodeAccessToken(tokens.accessToken),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpiresAt = user.accessTokenExpiresAt;
        token.claims = user.claims;
        return token;
      }

      if (!token.accessToken || !token.refreshToken || !token.accessTokenExpiresAt) {
        return token;
      }

      const refreshThresholdMs = AUTH_CONFIG.refreshLeewaySeconds * 1000;
      const shouldRefresh = Date.now() >= token.accessTokenExpiresAt - refreshThresholdMs;

      if (!shouldRefresh) {
        return token;
      }

      try {
        const rotated = await refreshAccessToken(token.refreshToken);
        token.accessToken = rotated.accessToken;
        token.refreshToken = rotated.refreshToken;
        token.accessTokenExpiresAt = Date.now() + rotated.expiresIn * 1000;
        token.claims = decodeAccessToken(rotated.accessToken);
        token.error = undefined;
        return token;
      } catch {
        token.error = "RefreshAccessTokenError";
        token.accessToken = undefined;
        token.refreshToken = undefined;
        token.accessTokenExpiresAt = undefined;
        token.claims = undefined;
        return token;
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.accessTokenExpiresAt = token.accessTokenExpiresAt;
      session.claims = token.claims;
      session.error = token.error;
      return session;
    },
  },
  events: {
    async signOut({ token }) {
      if (!token?.refreshToken) return;
      await logoutFromBackend(token.refreshToken);
    },
  },
};

export async function getAuthSession() {
  return getServerSession(authOptions);
}
