import { useEffect, useState } from "react"
import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useNavigate } from "react-router-dom"
import axios from "axios"

// adjust path if needed
import { BUTTON_CLASSES, INPUTWRAPPER } from "../assets/dummy"

const INITIAL_FORM = {
  email: "",
  password: "",
}

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [rememberMe, setRememberMe] = useState(false)

  const navigate = useNavigate()
  const url = "http://localhost:4000"

  // Restore session if token exists
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")

    if (token) {
      ;(async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })

          if (data.success) {
            onSubmit?.({ token, userId, ...data.user })
            toast.success("Session restored. Redirecting...")
            navigate("/")
          } else {
            localStorage.clear()
          }
        } catch (error) {
          localStorage.clear()
        }
      })()
    }
  }, [navigate, onSubmit])

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Submit login
  // ONLY showing changed part inside handleSubmit

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await axios.post(
      `${url}/api/user/login`,
      formData
    );

    if (!data.token) throw new Error("Login failed");

    // ALWAYS store token
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.user.id);

    setFormData(INITIAL_FORM);

    onSubmit?.({
      token: data.token,
      userId: data.user.id,
      ...data.user,
    });

    toast.success("Login successful!");

    navigate("/", { replace: true });

  } catch (err) {
    const msg =
      err?.response?.data?.message || err.message || "Error occurred";
    toast.error(msg);
  } 
  finally {
    setLoading(false);
  }
};

  // Input fields config
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ]

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
      />

      {/* Header */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800">
          Welcome Back
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Sign in to continue to TaskFlow
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(
          ({ name, type, placeholder, icon: Icon, isPassword }) => (
            <div key={name} className="relative">
              <div className={INPUTWRAPPER}>
                <Icon className="w-5 h-5 text-gray-400" />

                <input
                  type={type}
                  name={name}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full focus:outline-none text-sm text-gray-700"
                  required
                />

                {isPassword && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* Remember me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
          />
          <label
            htmlFor="rememberMe"
            className="ml-2 text-sm text-gray-700"
          >
            Remember Me
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={BUTTON_CLASSES}
          disabled={loading}
        >
          {loading ? (
            "Logging in..."
          ) : (
            <div className="flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </div>
          )}
        </button>
      </form>

      {/* Switch */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
          onClick={onSwitchMode}
        >
          Sign Up
        </button>
      </p>
    </div>
  )
}

export default Login