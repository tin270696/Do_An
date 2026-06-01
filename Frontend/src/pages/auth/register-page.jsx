import RegForm from "@/components/auth/reg-form";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  function handleRegistered() {
    navigate("/profile");
  }
  return <RegForm onRegistered={handleRegistered} />;
}