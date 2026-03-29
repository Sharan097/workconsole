import React, { useState } from "react";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BUTTONCLASSES,
  FIELDS,
  Inputwrapper,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
} from "../assets/dummy";

// const API_URL = "http://localhost:4000";

const API_URL = import.meta.env.VITE_API_URL;

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
};

const SignUp = ({ onSwitchMode, onSubmit }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage({ text: "", type: "" });

  try {
    const { data } = await axios.post(
      `${API_URL}/api/user/register`,
      formData
    );

    console.log("Signup Successful", data);

    // DO NOT STORE TOKEN HERE
    // DO NOT LOGIN USER HERE

    setMessage({
      text: "Registration successful! Redirecting to login...",
      type: "success",
    });

    setFormData(INITIAL_FORM);

    // ONLY REDIRECT TO LOGIN
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 800);

  } catch (err) {
    setMessage({
      text:
        err.response?.data?.message ||
        "An error occurred. Please try again.",
      type: "error",
    });
  } finally {
    setLoading(false);
  }
}; 

  return (
    <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      
      {/* HEADER */}
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <UserPlus className="text-white w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold">Create Account</h2>
        <p className="text-gray-500 text-sm mt-1">
          Join TaskFlow to manage your tasks
        </p>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={
            message.type === "success"
              ? MESSAGE_SUCCESS
              : MESSAGE_ERROR
          }
        >
          {message.text}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) =>
                setFormData({ ...formData, [name]: e.target.value })
              }
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />
          </div>
        ))}

        <button type="submit" className={BUTTONCLASSES} disabled={loading}>
          {loading ? (
            "Signing Up..."
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Sign Up
            </>
          )}
        </button>
      </form>

      {/* SWITCH */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;















// import React, { useState } from "react";
// import { UserPlus } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import {
//   BUTTONCLASSES,
//   FIELDS,
//   Inputwrapper,
//   MESSAGE_ERROR,
//   MESSAGE_SUCCESS,
// } from "../assets/dummy";

// const API_URL = "http://localhost:4000";

// const INITIAL_FORM = {
//   name: "",
//   email: "",
//   password: "",
// };

// const SignUp = ({ onSwitchMode, onSubmit }) => {
//   const [formData, setFormData] = useState(INITIAL_FORM);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ text: "", type: "" });

//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage({ text: "", type: "" });

//     try {
//       const { data } = await axios.post(
//         `${API_URL}/api/user/register`,
//         formData
//       );

//       console.log("Signup Successful", data);

//       // Optional: store token if needed
//       if (data.token) {
//         localStorage.setItem("token", data.token);
//       }

//       setMessage({
//         text: "Registration successful! Redirecting to login...",
//         type: "success",
//       });

//       setFormData(INITIAL_FORM);

//       // optional
//       // onSubmit?.(data.user);

//       // ✅ redirect AFTER success
//       setTimeout(() => {
//         navigate("/login", { replace: true });
//       }, 1000);

//     } catch (err) {
//       console.error("Signup error:", err);

//       setMessage({
//         text:
//           err.response?.data?.message ||
//           "An error occurred. Please try again.",
//         type: "error",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8">
      
//       {/* HEADER */}
//       <div className="mb-6 text-center">
//         <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
//           <UserPlus className="text-white w-7 h-7" />
//         </div>
//         <h2 className="text-xl font-bold">Create Account</h2>
//         <p className="text-gray-500 text-sm mt-1">
//           Join TaskFlow to manage your tasks
//         </p>
//       </div>

//       {/* MESSAGE */}
//       {message.text && (
//         <div
//           className={
//             message.type === "success"
//               ? MESSAGE_SUCCESS
//               : MESSAGE_ERROR
//           }
//         >
//           {message.text}
//         </div>
//       )}

//       {/* FORM */}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
//           <div key={name} className={Inputwrapper}>
//             <Icon className="text-purple-500 w-5 h-5 mr-2" />
//             <input
//               type={type}
//               placeholder={placeholder}
//               value={formData[name]}
//               onChange={(e) =>
//                 setFormData({ ...formData, [name]: e.target.value })
//               }
//               className="w-full focus:outline-none text-sm text-gray-700"
//               required
//             />
//           </div>
//         ))}

//         <button type="submit" className={BUTTONCLASSES} disabled={loading}>
//           {loading ? "Signing Up..." : (
//             <>
//               <UserPlus className="w-4 h-4" /> Sign Up
//             </>
//           )}
//         </button>
//       </form>

//       {/* SWITCH */}
//       <p className="text-center text-sm text-gray-600 mt-6">
//         Already have an account?{" "}
//         <button
//           onClick={onSwitchMode}
//           className="text-purple-600 hover:text-purple-700 hover:underline font-medium"
//         >
//           Login
//         </button>
//       </p>
//     </div>
//   );
// };

// export default SignUp;