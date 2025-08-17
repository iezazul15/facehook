import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import Field from "../common/Field";

export default function LoginForm() {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const submitForm = async (formData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_BASE_URL}/auth/login`,
        {
          ...formData,
        }
      );
      if (response.status === 200) {
        const { user, token } = response.data;
        const { token: authToken, refreshToken } = token;
        setAuth({ ...auth, user, authToken, refreshToken });
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
      setError("root.random", {
        type: "random",
        message: `User with email: ${formData.email} was not found`,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="border-b border-[#3F3F3F] pb-10 lg:pb-[60px]"
    >
      <Field label="Email" error={errors.email}>
        <input
          className={`auth-input ${
            errors.email ? "border-red-500" : "border-gray-700"
          }`}
          type="email"
          name="email"
          id="email"
          {...register("email", { required: "Email id is required" })}
        />
      </Field>

      <Field label="Password" error={errors.password}>
        <input
          className={`auth-input ${
            errors.password ? "border-red-500" : "border-gray-700"
          }`}
          type="password"
          name="password"
          id="password"
          {...register("password", {
            required: "Password id is required",
            minLength: {
              value: 8,
              message: "Password must be 8 characters long",
            },
          })}
        />
      </Field>

      <p className="text-red-600 mb-4">{errors?.root?.random?.message}</p>

      <Field>
        {/* here if I don't specify type="submit" it sets it to submit by default as it's in the form */}
        <button className="auth-input bg-lwsGreen font-bold text-deepDark transition-all hover:opacity-90">
          Login
        </button>
      </Field>
    </form>
  );
}
