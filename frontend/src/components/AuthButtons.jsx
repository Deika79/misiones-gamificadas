import { useAuth0 } from "@auth0/auth0-react";

export default function AuthButtons() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    isLoading,
    error
  } = useAuth0();

  console.log("AUTH DEBUG:", {
    isLoading,
    isAuthenticated,
    user,
    error
  });

  // =========================
  // LOADING
  // =========================

  if (isLoading) return <p>Cargando Auth0...</p>;

  if (error) return <p>Error: {error.message}</p>;

  // =========================
  // RENDER
  // =========================

  return (
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 999 }}>
      {!isAuthenticated ? (
        <button
          onClick={() =>
            loginWithRedirect({
              appState: {
                returnTo: window.location.pathname
              }
            })
          }
        >
          Login
        </button>
      ) : (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span>{user?.email}</span>

          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin
                }
              })
            }
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}