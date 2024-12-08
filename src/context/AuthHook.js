// // src/hooks/useAuth.js
// "use client";
// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export function useAuth(requireAuth = true) {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (requireAuth && status === "unauthenticated") {
//       router.push("/auth/signin");
//     }
//   }, [status, requireAuth, router]);

//   return {
//     session,
//     status,
//     isAuthenticated: status === "authenticated",
//     isLoading: status === "loading",
//   };
// }