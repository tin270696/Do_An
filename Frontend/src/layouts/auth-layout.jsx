import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function AuthLayout() {
  return (
    <>
      <Navbar />

      <main className="flex w-full flex-1 items-start justify-center py-5">
        <Outlet />
      </main>

      <Footer companyName="Your company" year={new Date().getFullYear()} />
    </>
  )
}

export default AuthLayout;