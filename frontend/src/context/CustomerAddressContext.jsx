import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CustomerAddressContext = createContext(null);

const TOKEN_KEY = "atulyam_customer_token";
const SELECTED_ADDRESS_KEY = "atulyam_selected_address";

const API_URL =
  import.meta.env.VITE_API_URL;

export const CustomerAddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const saved = localStorage.getItem(
        SELECTED_ADDRESS_KEY
      );

      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [addressChecked, setAddressChecked] = useState(false);

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  /* =========================================================
     FETCH ADDRESSES
  ========================================================= */

  const fetchAddresses = async () => {
    const token = getToken();

    if (!token) {
      setAddresses([]);
      setSelectedAddress(null);
      setAddressChecked(true);

      localStorage.removeItem(
        SELECTED_ADDRESS_KEY
      );

      return [];
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/customer-addresses`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => []);

      if (!response.ok) {
        throw new Error(
          typeof data?.detail === "string"
            ? data.detail
            : "Unable to fetch addresses."
        );
      }

      setAddresses(data);

      /* -----------------------------------------
         Restore previously selected address
      ----------------------------------------- */

      const savedSelected =
        localStorage.getItem(
          SELECTED_ADDRESS_KEY
        );

      let nextSelected = null;

      if (savedSelected) {
        try {
          const parsedSelected =
            JSON.parse(savedSelected);

          nextSelected = data.find(
            (address) =>
              address.id === parsedSelected.id
          );
        } catch {
          nextSelected = null;
        }
      }

      /* -----------------------------------------
         If saved address no longer exists,
         use default address
      ----------------------------------------- */

      if (!nextSelected) {
        nextSelected =
          data.find(
            (address) => address.is_default
          ) ||
          data[0] ||
          null;
      }

      setSelectedAddress(nextSelected);

      if (nextSelected) {
        localStorage.setItem(
          SELECTED_ADDRESS_KEY,
          JSON.stringify(nextSelected)
        );
      } else {
        localStorage.removeItem(
          SELECTED_ADDRESS_KEY
        );
      }

      return data;
    } catch (error) {
      console.error(
        "Address fetch failed:",
        error
      );

      return [];
    } finally {
      setLoading(false);
      setAddressChecked(true);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    const token = getToken();

    if (token) {
      fetchAddresses();
    } else {
      setAddresses([]);
      setSelectedAddress(null);
      setAddressChecked(true);

      localStorage.removeItem(
        SELECTED_ADDRESS_KEY
      );
    }
  }, []);

  /* =========================================================
     SELECT ADDRESS
  ========================================================= */

  const selectAddress = (address) => {
    if (!address) {
      setSelectedAddress(null);

      localStorage.removeItem(
        SELECTED_ADDRESS_KEY
      );

      return;
    }

    setSelectedAddress(address);

    localStorage.setItem(
      SELECTED_ADDRESS_KEY,
      JSON.stringify(address)
    );
  };

  /* =========================================================
     ADD ADDRESS
  ========================================================= */

  const addAddress = async (addressData) => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Please sign in to save an address."
      );
    }

    const response = await fetch(
      `${API_URL}/customer-addresses`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(addressData),
      }
    );

    const data = await response.json().catch(
      () => ({})
    );

    if (!response.ok) {
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail[0]?.msg
          : "Unable to save address.";

      throw new Error(message);
    }

    setAddresses((prev) => [
      data,
      ...prev,
    ]);

    /* -----------------------------------------
       Backend decides default address.
       First address should automatically
       become selected.
    ----------------------------------------- */

    if (
      data.is_default ||
      addresses.length === 0
    ) {
      selectAddress(data);
    }

    return data;
  };

  /* =========================================================
     UPDATE ADDRESS
  ========================================================= */

  const updateAddress = async (
    addressId,
    addressData
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Please sign in to update an address."
      );
    }

    const response = await fetch(
      `${API_URL}/customer-addresses/${addressId}`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(addressData),
      }
    );

    const data = await response.json().catch(
      () => ({})
    );

    if (!response.ok) {
      const message =
        typeof data?.detail === "string"
          ? data.detail
          : Array.isArray(data?.detail)
          ? data.detail[0]?.msg
          : "Unable to update address.";

      throw new Error(message);
    }

    setAddresses((prev) =>
      prev.map((address) =>
        address.id === addressId
          ? data
          : address
      )
    );

    /* -----------------------------------------
       Keep selected address updated
    ----------------------------------------- */

    if (
      selectedAddress?.id === addressId
    ) {
      selectAddress(data);
    }

    return data;
  };

  /* =========================================================
     DELETE ADDRESS
  ========================================================= */

  const deleteAddress = async (
    addressId
  ) => {
    const token = getToken();

    if (!token) {
      throw new Error(
        "Please sign in to delete an address."
      );
    }

    const response = await fetch(
      `${API_URL}/customer-addresses/${addressId}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response
        .json()
        .catch(() => ({}));

      const message =
        typeof data?.detail === "string"
          ? data.detail
          : "Unable to delete address.";

      throw new Error(message);
    }

    /* -----------------------------------------
       Remove deleted address
    ----------------------------------------- */

    const remaining = addresses.filter(
      (address) =>
        address.id !== addressId
    );

    setAddresses(remaining);

    /* -----------------------------------------
       If deleted address was selected,
       select another available address
    ----------------------------------------- */

    if (
      selectedAddress?.id === addressId
    ) {
      const nextAddress =
        remaining.find(
          (address) => address.is_default
        ) ||
        remaining[0] ||
        null;

      if (nextAddress) {
        selectAddress(nextAddress);
      } else {
        setSelectedAddress(null);

        localStorage.removeItem(
          SELECTED_ADDRESS_KEY
        );
      }
    }
  };

  /* =========================================================
     CLEAR SELECTED ADDRESS
  ========================================================= */

  const clearSelectedAddress = () => {
    setSelectedAddress(null);

    localStorage.removeItem(
      SELECTED_ADDRESS_KEY
    );
  };

  /* =========================================================
     CONTEXT
  ========================================================= */

  return (
    <CustomerAddressContext.Provider
      value={{
        addresses,
        selectedAddress,

        loading,
        addressChecked,

        fetchAddresses,
        selectAddress,

        addAddress,
        updateAddress,
        deleteAddress,

        clearSelectedAddress,
      }}
    >
      {children}
    </CustomerAddressContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */

export const useCustomerAddress = () => {
  const context = useContext(
    CustomerAddressContext
  );

  if (!context) {
    throw new Error(
      "useCustomerAddress must be used within CustomerAddressProvider"
    );
  }

  return context;
};

export default CustomerAddressContext;