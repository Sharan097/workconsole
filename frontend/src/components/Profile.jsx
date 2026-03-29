// import React, { useEffect, useState } from "react"
// import axios from "axios"
// import { toast, ToastContainer } from "react-toastify"
// import "react-toastify/dist/ReactToastify.css"

// import {
//   BACK_BUTTON,
//   SECTION_WRAPPER,
//   INPUT_WRAPPER,
//   FULL_BUTTON,
//   personalFields,
//   securityFields,
// } from "../assets/dummy"

// import {
//   ChevronLeft,
//   UserCircle,
//   Shield,
//   Lock,
//   Save,
// } from "lucide-react"

// import { useNavigate } from "react-router-dom"

// const API_URL = "http://localhost:4000"

// const Profile = ({ setCurrentUser }) => {
//   const [profile, setProfile] = useState({ name: "", email: "" })
//   const [passwords, setPasswords] = useState({
//     current: "",
//     new: "",
//     confirm: "",
//   })

//   const navigate = useNavigate()

//   // ✅ LOAD USER DATA
//   useEffect(() => {
//     const token = localStorage.getItem("token")
//     if (!token) return

//     axios
//       .get(`${API_URL}/api/user/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(({ data }) => {
//         if (data.success) {
//           setProfile({
//             name: data.user.name,
//             email: data.user.email,
//           })
//         } else {
//           toast.error(data.message)
//         }
//       })
//       .catch(() => toast.error("Unable to load profile"))
//   }, [])

//   // ✅ SAVE PROFILE
//   const saveProfile = async (e) => {
//     e.preventDefault()
//     try {
//       const token = localStorage.getItem("token")

//       const { data } = await axios.put(
//         `${API_URL}/api/user/profile`,
//         {
//           name: profile.name,
//           email: profile.email,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       if (data.success) {
//         setCurrentUser((prev) => ({
//           ...prev,
//           name: profile.name,
//           avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
//             profile.name
//           )}&background=random`,
//         }))

//         toast.success("Profile Updated")
//       } else {
//         toast.error(data.message)
//       }
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Profile update failed"
//       )
//     }
//   }

//   // ✅ CHANGE PASSWORD
//   const changePassword = async (e) => {
//     e.preventDefault()

//     if (passwords.new !== passwords.confirm) {
//       return toast.error("Passwords do not match")
//     }

//     try {
//       const token = localStorage.getItem("token")

//       const { data } = await axios.put(
//         `${API_URL}/api/user/password`,
//         {
//           currentPassword: passwords.current,
//           newPassword: passwords.new,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       )

//       if (data.success) {
//         toast.success("Password Changed")
//         setPasswords({ current: "", new: "", confirm: "" })
//       } else {
//         toast.error(data.message)
//       }
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Password update failed"
//       )
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <ToastContainer position="top-center" autoClose={3000} />

//       <div className="max-w-4xl mx-auto p-4 md:p-6">
//         {/* BACK BUTTON */}
//         <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
//           <ChevronLeft className="w-5 h-5 mr-1" />
//           Back to Dashboard
//         </button>

//         {/* HEADER */}
//         <div className="flex items-center gap-4 mb-8">
//           <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
//             {profile.name
//               ? profile.name.charAt(0).toUpperCase()
//               : "U"}
//           </div>

//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               Account Settings
//             </h1>
//             <p className="text-sm text-gray-500">
//               Manage your profile and security settings
//             </p>
//           </div>
//         </div>

//         {/* GRID */}
//         <div className="grid md:grid-cols-2 gap-6 md:gap-8">
//           {/* PERSONAL INFO */}
//           <section className={SECTION_WRAPPER}>
//             <div className="flex items-center gap-2 mb-6">
//               <UserCircle className="text-purple-500 w-5 h-5" />
//               <h2 className="text-xl font-semibold text-gray-800">
//                 Personal Information
//               </h2>
//             </div>

//             <form onSubmit={saveProfile} className="space-y-4">
//               {personalFields.map(
//                 ({ name, type, placeholder, icon: Icon }) => (
//                   <div key={name} className={INPUT_WRAPPER}>
//                     <Icon className="text-purple-500 w-5 h-5 mr-2" />
//                     <input
//                       type={type}
//                       placeholder={placeholder}
//                     //   value={profile[name]}
//                     value={profile[name] || ""}
//                       onChange={(e) =>
//                         setProfile({
//                           ...profile,
//                           [name]: e.target.value,
//                         })
//                       }
//                       className="w-full outline-none text-sm"
//                       required
//                     />
//                   </div>
//                 )
//               )}

//               <button className={FULL_BUTTON}>
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </button>
//             </form>
//           </section>

//           {/* SECURITY */}
//           <section className={SECTION_WRAPPER}>
//             <div className="flex items-center gap-2 mb-6">
//               <Shield className="text-purple-500 w-5 h-5" />
//               <h2 className="text-xl font-semibold text-gray-800">
//                 Security
//               </h2>
//             </div>

//             <form onSubmit={changePassword} className="space-y-4">
//               {securityFields.map(({ name, placeholder }) => (
//                 <div key={name} className={INPUT_WRAPPER}>
//                   <Lock className="text-purple-500 w-5 h-5 mr-2" />
//                   <input
//                     type="password"
//                     placeholder={placeholder}
//                     // value={passwords[name]}
//                     value={profile[name] || ""}
//                     onChange={(e) =>
//                       setPasswords({
//                         ...passwords,
//                         [name]: e.target.value,
//                       })
//                     }
//                     className="w-full outline-none text-sm"
//                     required
//                   />
//                 </div>
//               ))}

//               <button className={FULL_BUTTON}>
//                 <Shield className="w-4 h-4" />
//                 Change Password
//               </button>
//             </form>
//           </section>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Profile











import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import {
  BACK_BUTTON,
  SECTION_WRAPPER,
  INPUT_WRAPPER,
  FULL_BUTTON,
  personalFields,
  securityFields,
} from "../assets/dummy"

import {
  ChevronLeft,
  UserCircle,
  Shield,
  Lock,
  Save,
} from "lucide-react"

import { useNavigate } from "react-router-dom"

const API_URL = "http://localhost:4000"

const Profile = ({ user, setCurrentUser }) => {
  const navigate = useNavigate()

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  // SYNC USER (IMPORTANT FOR REAL-TIME REFLECT)
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
      })
    }
  }, [user])

  // LOAD FROM BACKEND (SAFE MERGE)
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return

    axios
      .get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.success) {
          setProfile({
            name: data.user.name || "",
            email: data.user.email || "",
          })
        }
      })
      .catch(() => toast.error("Unable to load profile"))
  }, [])

  // SAVE PROFILE (REAL-TIME UPDATE)
  const saveProfile = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")

      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        {
          name: profile.name,
          email: profile.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        const updatedUser = {
          ...user,
          name: profile.name,
          email: profile.email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        }




        // UPDATE GLOBAL STATE
        // setCurrentUser(updatedUser)

        //  UPDATE LOCAL STORAGE (IMPORTANT)
        // localStorage.setItem("currentUser", JSON.stringify(updatedUser))


        setCurrentUser((prev) => {
        const updated = {
            ...prev,
            name: profile.name,
            email: profile.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
            )}&background=random`,
        }

        localStorage.setItem("currentUser", JSON.stringify(updated))
        return updated
        })





        toast.success("Profile Updated Successfully ")
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Profile update failed"
      )
    }
  }

  // CHANGE PASSWORD
  const changePassword = async (e) => {
    e.preventDefault()

    if (passwords.new !== passwords.confirm) {
      return toast.error("Passwords do not match")
    }

    try {
      const token = localStorage.getItem("token")

      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      if (data.success) {
        toast.success("Password Updated Successfully")

        setPasswords({
          current: "",
          new: "",
          confirm: "",
        })
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Password update failed"
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* BACK */}
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Dashboard
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-fuchsia-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500">
              Manage your profile and security settings
            </p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* PERSONAL */}
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">
                Personal Information
              </h2>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(
                ({ name, type, placeholder, icon: Icon }) => (
                  <div key={name} className={INPUT_WRAPPER}>
                    <Icon className="text-purple-500 w-5 h-5 mr-2" />
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={profile[name] || ""}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          [name]: e.target.value,
                        })
                      }
                      className="w-full outline-none text-sm"
                      required
                    />
                  </div>
                )
              )}

              <button className={FULL_BUTTON}>
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </form>
          </section>

          {/* SECURITY */}
          <section className={SECTION_WRAPPER}>
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-purple-500 w-5 h-5" />
              <h2 className="text-xl font-semibold text-gray-800">
                Security
              </h2>
            </div>

            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder }) => (
                <div key={name} className={INPUT_WRAPPER}>
                  <Lock className="text-purple-500 w-5 h-5 mr-2" />
                  <input
                    type="password"
                    placeholder={placeholder}
                    value={passwords[name] || ""}
                    onChange={(e) =>
                      setPasswords({
                        ...passwords,
                        [name]: e.target.value,
                      })
                    }
                    className="w-full outline-none text-sm"
                    required
                  />
                </div>
              ))}

              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4" />
                Change Password
              </button>
            </form>



            {/* DANGER ZONE */}
          <div className="md:col-span-2 mt-2">
            <div className="bg-white rounded-xl border border-red-100 p-6">
              
              {/* HEADER */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-red-500 font-semibold text-sm flex items-center gap-2">
                  ⚠ Danger Zone
                </span>
              </div>

              {/* LOGOUT BUTTON */}
              <button
                onClick={() => {
                  localStorage.removeItem("token")
                  localStorage.removeItem("currentUser")
                  setCurrentUser(null)
                  navigate("/login", { replace: true })
                }}
                className="w-full border border-red-200 text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>


          </section>
        </div>
      </div>
    </div>
  )
}

export default Profile