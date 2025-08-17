import { useNavigate } from "react-router";
import LogoutIcon from "../assets/icons/logout.svg";
import useAuth from "../hooks/useAuth";

export default function Logout() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const handleClick = () => {
    setAuth({});
    navigate("/login");
  };
  return (
    <button className="icon-btn" onClick={handleClick}>
      <img src={LogoutIcon} alt="Logout" />
    </button>
  );
}
