import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CustomerAuthContext = createContext(null);

const TOKEN_KEY = "atulyam_customer_token";
const CUSTOMER_KEY = "atulyam_customer";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000/api/v1";

/* =========================================================
   API ERROR MESSAGE HELPER
========================================================= */

const getApiErrorMessage = (
  data,
  fallbackMessage
) => {
  if (!data) {
    return fallbackMessage;
  }

  // Normal FastAPI string error
  if (typeof data.detail === "string") {
    return data.detail;
  }

  // FastAPI validation errors
  if (Array.isArray(data.detail)) {
    const firstError = data.detail[0];

    if (firstError?.msg) {
      return firstError.msg;
    }

    return fallbackMessage;
  }

  // Object error
  if (
    data.detail &&
    typeof data.detail === "object"
  ) {
    return (
      data.detail.message ||
      data.detail.msg ||
      fallbackMessage
    );
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return fallbackMessage;
};

/* =========================================================
   PROVIDER
========================================================= */

export const CustomerAuthProvider = ({
  children,
}) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [customer, setCustomer] = useState(() => {
    try {
      const savedCustomer =
        localStorage.getItem(CUSTOMER_KEY);

      return savedCustomer
        ? JSON.parse(savedCustomer)
        : null;
    } catch {
      return null;
    }
  });

  const [authChecked, setAuthChecked] =
    useState(false);

  /* =======================================================
     VERIFY SAVED CUSTOMER TOKEN
  ======================================================= */

  useEffect(() => {
    const verifyCustomer = async () => {
      const savedToken =
        localStorage.getItem(TOKEN_KEY);

      if (!savedToken) {
        setToken(null);
        setCustomer(null);
        setAuthChecked(true);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/customer-auth/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          }
        );

        const data = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          throw new Error(
            getApiErrorMessage(
              data,
              "Your session has expired. Please sign in again."
            )
          );
        }

        setToken(savedToken);
        setCustomer(data);

        localStorage.setItem(
          CUSTOMER_KEY,
          JSON.stringify(data)
        );
      } catch (error) {
        console.error(
          "Customer auth verification failed:",
          error
        );

        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CUSTOMER_KEY);

        setToken(null);
        setCustomer(null);
      } finally {
        setAuthChecked(true);
      }
    };

    verifyCustomer();
  }, []);

  /* =======================================================
     LOGIN
  ======================================================= */

  const login = async (
    email,
    password
  ) => {
    const response = await fetch(
      `${API_URL}/customer-auth/login`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      throw new Error(
        getApiErrorMessage(
          data,
          "Unable to sign in. Please check your email and password."
        )
      );
    }

    /* -----------------------------------------
       Save authentication
    ----------------------------------------- */

    localStorage.setItem(
      TOKEN_KEY,
      data.access_token
    );

    localStorage.setItem(
      CUSTOMER_KEY,
      JSON.stringify(data.customer)
    );

    setToken(data.access_token);
    setCustomer(data.customer);

    /* -----------------------------------------
       Notify address context
       that customer has logged in
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("customer-auth-changed")
    );

    return data;
  };

  /* =======================================================
     SIGNUP
  ======================================================= */

  const signup = async (
    name,
    email,
    phone,
    password
  ) => {
    const response = await fetch(
      `${API_URL}/customer-auth/signup`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone
            ? phone.trim()
            : null,
          password,
        }),
      }
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      throw new Error(
        getApiErrorMessage(
          data,
          "Unable to create your account. Please try again."
        )
      );
    }

    /* -----------------------------------------
       Save authentication
    ----------------------------------------- */

    localStorage.setItem(
      TOKEN_KEY,
      data.access_token
    );

    localStorage.setItem(
      CUSTOMER_KEY,
      JSON.stringify(data.customer)
    );

    setToken(data.access_token);
    setCustomer(data.customer);

    /* -----------------------------------------
       Notify address context
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("customer-auth-changed")
    );

    return data;
  };

  /* =======================================================
     LOGOUT
  ======================================================= */

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);

    localStorage.removeItem(
      "atulyam_selected_address"
    );

    setToken(null);
    setCustomer(null);

    /* -----------------------------------------
       Notify other contexts
    ----------------------------------------- */

    window.dispatchEvent(
      new Event("customer-auth-changed")
    );
  };

  /* =======================================================
     AUTH STATUS
  ======================================================= */

  const isAuthenticated =
    !!token && !!customer;

  /* =======================================================
     CONTEXT
  ======================================================= */

  return (
    <CustomerAuthContext.Provider
      value={{
        token,
        customer,
        isAuthenticated,
        authChecked,

        login,
        signup,
        logout,
      }}
    >
      {children}
    </CustomerAuthContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */

export const useCustomerAuth = () => {
  const context = useContext(
    CustomerAuthContext
  );

  if (!context) {
    throw new Error(
      "useCustomerAuth must be used within CustomerAuthProvider"
    );
  }

  return context;
};

export default CustomerAuthContext;