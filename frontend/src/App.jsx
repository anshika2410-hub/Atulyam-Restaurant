import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AdminOffersPage from "./pages/admin/OffersPage.jsx";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";
import PageLayout from "./components/layout/PageLayout.jsx";
import PageTransition from "./components/animation/PageTransition.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import OffersPage from "./pages/public/OffersPage.jsx";
import AdminMenuPage from "./pages/admin/MenuPage.jsx";
import HomePage from "./pages/public/HomePage.jsx";
import AboutPage from "./pages/public/AboutPage.jsx";
import MenuPage from "./pages/public/MenuPage.jsx";
import GalleryPage from "./pages/public/GalleryPage.jsx";
import CateringPage from "./pages/public/CateringPage.jsx";
import ContactPage from "./pages/public/ContactPage.jsx";
import ReservationPage from "./pages/public/ReservationPage.jsx";
import OrderOnlinePage from "./pages/public/OrderOnlinePage.jsx";
import OrdersPage from "./pages/admin/OrdersPage.jsx";
import AdminGallery from "./pages/admin/AdminGallery";
import Container from "./components/ui/Container.jsx";
import Button from "./components/ui/Button.jsx";
import AdminCatering from "./pages/admin/AdminCatering";
import CateringOccasionPage from "./pages/public/CateringOccasionPage.jsx";
import { UtensilsCrossed } from "lucide-react";
import CheckoutPage from "./pages/public/CheckoutPage.jsx";
import OrderConfirmationPage from "./pages/public/OrderConfirmationPage.jsx";
import OrderTrackingPage from "./pages/public/OrderTrackingPage.jsx";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import CustomerLoginPage from "./pages/public/CustomerLoginPage.jsx";
import AdminCustomersPage from "./pages/admin/CustomersPage.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import {
  CustomerAuthProvider,
  useCustomerAuth,
} from "./context/CustomerAuthContext";
import CustomerOrdersPage from "./pages/public/CustomerOrdersPage.jsx";
import CustomerProfilePage from "./pages/public/CustomerProfilePage.jsx";
import CustomerSignupPage from "./pages/public/CustomerSignupPage.jsx";
import { CustomerAddressProvider } from "./context/CustomerAddressContext";
import CustomerAddressesPage from "./pages/public/CustomerAddressesPage.jsx";
import CustomerOrderDetailsPage from "./pages/public/CustomerOrderDetailsPage.jsx";
// Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";


const PagePlaceholder = ({ title, description }) => (
  <Container className="py-36 min-h-[70vh] flex flex-col items-center justify-center text-center">

    <div className="w-12 h-12 rounded-full border border-brand-500/40 bg-dark-850 flex items-center justify-center text-brand-400 mb-6 shadow-glow">
      <UtensilsCrossed className="w-5 h-5 text-brand-500" />
    </div>

    <span className="text-[11px] uppercase tracking-widest-xl text-brand-400 font-semibold mb-2">
      ✦ Atulyam Luxury Fine Dining ✦
    </span>

    <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-ivory-100 mb-4">
      {title}
    </h1>

    <p className="text-sm sm:text-base text-ivory-400 max-w-md mb-8 font-light leading-relaxed">
      {description}
    </p>

    <Button
      variant="secondary"
      size="md"
      onClick={() => window.location.href = "/"}
    >
      Return Home
    </Button>

  </Container>
);


// ================= PROTECTED ADMIN ROUTE =================

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useAuth();

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const CustomerProtectedRoute = ({ children }) => {
  const { isAuthenticated, authChecked } = useCustomerAuth();
  const location = useLocation();

  if (!authChecked) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/customer/login"
        state={{
          from: location.pathname + location.search,
        }}
        replace
      />
    );
  }

  return children;
};

// ================= APP ROUTES =================

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">

      <Routes
        location={location}
        key={location.pathname}
      >

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />


<Route
  path="/customer/login"
  element={
    <PageTransition>
      <CustomerLoginPage />
    </PageTransition>
  }
/>

<Route
  path="/customer/signup"
  element={
    <PageTransition>
      <CustomerSignupPage />
    </PageTransition>
  }
/>
<Route
  path="/customer/addresses"
  element={
    <CustomerProtectedRoute>
      <PageTransition>
        <CustomerAddressesPage />
      </PageTransition>
    </CustomerProtectedRoute>
  }
/>

<Route
  path="/customer/orders"
  element={<CustomerOrdersPage />}
/>

<Route
  path="/customer/orders/:orderId"
  element={<CustomerOrderDetailsPage />}
/>

        {/* ================= ABOUT ================= */}

        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />

        {/* ================= MENU ================= */}

        <Route
          path="/menu"
          element={
            <PageTransition>
              <MenuPage />
            </PageTransition>
          }
        />

        {/* ================= GALLERY ================= */}

        <Route
          path="/gallery"
          element={
            <PageTransition>
              <GalleryPage />
            </PageTransition>
          }
        />

        {/* ================= CATERING ================= */}

        <Route
          path="/catering"
          element={
            <PageTransition>
              <CateringPage />
            </PageTransition>
          }
        />
{/* ================= CATERING ================= */}

<Route
  path="/catering"
  element={
    <PageTransition>
      <CateringPage />
    </PageTransition>
  }
/>

<Route
  path="/catering/:occasion"
  element={
    <PageTransition>
      <CateringOccasionPage />
    </PageTransition>
  }
/>
        {/* ================= CONTACT ================= */}

        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />

        {/* ================= RESERVATION ================= */}

        <Route
          path="/reservation"
          element={
            <PageTransition>
              <ReservationPage />
            </PageTransition>
          }
        />

        {/* ================= ORDER ONLINE ================= */}

        <Route
  path="/order-online"
  element={
    <CustomerProtectedRoute>
      <PageTransition>
        <OrderOnlinePage />
      </PageTransition>
    </CustomerProtectedRoute>
  }
/>


{/* ================= CHECKOUT ================= */}

<Route
  path="/checkout"
  element={
    <CustomerProtectedRoute>
      <PageTransition>
        <CheckoutPage />
      </PageTransition>
    </CustomerProtectedRoute>
  }
/>
<Route
  path="/order-confirmation/:orderNumber"
  element={
    <PageTransition>
      <OrderConfirmationPage />
    </PageTransition>
  }
/>
<Route
  path="/customer/profile"
  element={<CustomerProfilePage />}
/>
<Route
  path="/order-tracking"
  element={
    <PageTransition>
      <OrderTrackingPage />
    </PageTransition>
  }
/>

<Route
  path="/order-tracking/:orderNumber"
  element={
    <PageTransition>
      <OrderTrackingPage />
    </PageTransition>
  }
/>

        {/* ================= OFFERS ================= */}
<Route
  path="/offers"
  element={
    <PageTransition>
      <OffersPage />
    </PageTransition>
  }
/>


        {/* ================================================= */}
        {/* ================= ADMIN LOGIN ==================== */}
        {/* ================================================= */}

        <Route
          path="/admin/login"
          element={
            <PageTransition>
              <AdminLogin />
            </PageTransition>
          }
        />


        {/* ================================================= */}
        {/* ================= ADMIN DASHBOARD ================ */}
        {/* ================================================= */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <PageTransition>
                <AdminDashboard />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
  path="/admin/offers"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PageTransition>
          <AdminOffersPage />
        </PageTransition>
      </AdminLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/reset-password"
  element={<ResetPasswordPage />}
/>
<Route
  path="/admin/catering"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AdminCatering />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

          <Route
  path="/admin/orders"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PageTransition>
          <OrdersPage />
        </PageTransition>
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/customers"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PageTransition>
          <AdminCustomersPage />
        </PageTransition>
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/menu"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <PageTransition>
          <AdminMenuPage />
        </PageTransition>
      </AdminLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/admin/gallery"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <AdminGallery />
      </AdminLayout>
    </ProtectedRoute>
  }
/>

        {/* ================= 404 ================= */}

        <Route
          path="*"
          element={
            <PageTransition>
              <PagePlaceholder
                title="Page Not Found"
                description="The page you are looking for could not be found."
              />
            </PageTransition>
          }
        />

      </Routes>

    </AnimatePresence>
  );
};


// ================= ROOT APP =================

function App() {
  return (
    <AuthProvider>
  <CustomerAuthProvider>
    <CustomerAddressProvider>
      <PageLayout>
        <ScrollToTop />
        <AppRoutes />
      </PageLayout>
    </CustomerAddressProvider>
  </CustomerAuthProvider>
</AuthProvider>
  );
}

export default App;