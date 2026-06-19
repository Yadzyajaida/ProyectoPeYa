import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60, // 1 día (en segundos)
  },
  
  callbacks: {
    async signIn() {
      return true; 
    },
  },
}); 

export { handler as GET, handler as POST };