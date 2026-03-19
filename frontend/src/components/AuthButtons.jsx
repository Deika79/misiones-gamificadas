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

  if (isLoading) return <p>Cargando Auth0...</p>;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ position: "fixed", top: 10, right: 10 }}>
      {!isAuthenticated ? (
        <button onClick={() => loginWithRedirect()}>
          Login
        </button>
      ) : (
        <div>
          <span>{user?.email}</span>
          <button
            onClick={() =>
              logout({
                logoutParams: {
                  returnTo: window.location.origin,
                },
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