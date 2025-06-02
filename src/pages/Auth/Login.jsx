import { useState, useContext } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    if (!validateEmail(email)) {
      setError("Email tidak valid");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Password tidak boleh kosong");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        // Navigate based on role
        switch (role) {
          case "superadmin":
            navigate("/superadmin/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          case "hrd":
            navigate("/hrd/dashboard");
            break;
          default:
            navigate("/user/dashboard");
        }
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;

        if (status === 401) {
          setError("Email atau password salah");
        } else if (status === 500) {
          setError("Terjadi kesalahan server, silakan coba lagi");
        } else if (data && data.message) {
          setError(data.message);
        } else {
          setError("Terjadi kesalahan, silakan coba lagi");
        }
      } else if (error.code === "ECONNABORTED") {
        setError("Koneksi timeout, silakan coba lagi");
      } else if (error.request) {
        setError("Tidak dapat terhubung ke server");
      } else {
        setError("Terjadi kesalahan, silakan coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold text-black -mt-1">
          Selamat Datang
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Silakan masukkan email dan password
        </p>

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email"
              className="p-2 border border-gray-300 rounded"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm text-gray-600 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center">
              <svg
                className="w-4 h-4 text-red-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`p-2 rounded text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            } transition-colors duration-200`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Memproses...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <p className="text-xs text-slate-800 mt-3">
            Belum punya akun?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
