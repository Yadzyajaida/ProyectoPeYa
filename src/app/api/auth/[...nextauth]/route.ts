import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // ESTA ES LA MAGIA: Solo permite correos de pedidosya.com
      if (user.email?.endsWith("@pedidosya.com")) {
        return true;
      }
      return false; // Si no es PeYa, rechaza el login
    },
  },
  pages: {
    signIn: '/auth/signin', // Aquí puedes crear tu propia página con el botón
  }
});

export { handler as GET, handler as POST };