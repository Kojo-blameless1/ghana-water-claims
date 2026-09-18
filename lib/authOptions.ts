import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions = {
  session: { strategy: "jwt" as const, maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        staffNo: { label: "Staff Number", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.staffNo || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { staffNo: credentials.staffNo } });
        if (!user) return null;
        if (!user.approved) throw new Error("Account pending approval");
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: String(user.id), name: user.name, email: user.staffNo, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) { token.role = user.role; token.staffNo = user.email; }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) { session.user.role = token.role; session.user.staffNo = token.staffNo; session.user.id = token.sub; }
      return session;
    },
  },
};