// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Link, useNavigate } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { motion } from "framer-motion";
// import * as z from "zod";
// import { Wallet } from "lucide-react";
// import { registerUser } from "../api/auth";
// import PasswordInput from "./../components/common/PasswordInput";

// // Validation schema
// const RegisterSchema = z.object({
//   fullName: z.string().min(2, "Full name is required"),
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   phoneNumber: z.string().optional(),
//   country: z.string().optional(),
//   dateOfBirth: z.string().optional(),
//   referralCode: z.string().optional(),
// });

// export default function RegisterPage() {
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(RegisterSchema),
//     defaultValues: {
//       fullName: "",
//       email: "",
//       password: "",
//       phoneNumber: "",
//       country: "",
//       dateOfBirth: "",
//       referralCode: "",
//     },
//   });

//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   async function onSubmit(values) {
//     setErrorMessage("");
//     setLoading(true);
//     try {
//      const data = await registerUser(values);

//       if (data?.otpSent) {
//         navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
//       } else {
//         setErrorMessage("OTP could not be sent. Please check your email.");
//       }

//     } catch (err) {
//       console.error(err);
//       setErrorMessage(err?.response?.data?.message?.message || "Registration failed. Try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen bg-[#f3f7f9] flex items-center justify-center p-6">
//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-8"
//         style={{ boxShadow: "0 14px 30px rgba(3,16,28,0.08)" }}
//       >
//         <div className="flex flex-col items-center">
//           <div className="w-24 h-24 rounded-full overflow-hidden -mt-12 mb-4 shadow-md flex items-center justify-center bg-blue-600">
//             <Wallet className="text-white w-12 h-12" />
//           </div>

//           <h1 className="text-2xl font-extrabold text-[#0b1226] text-center leading-tight">
//             Create Your Account
//             <br />
//             <span className="inline-block text-lg font-bold">Welcome to Kongossa-Pay</span>
//           </h1>
//           <p className="text-sm text-[#6b7280] mt-2">Register to get started</p>
//         </div>

//         <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
//           {/* Google Sign Up */}
//           {/* <button
//             type="button"
//             className="w-full flex items-center justify-center gap-3 border border-[#eef2f6] rounded-md py-3 shadow-sm hover:shadow-md transition-shadow"
//             onClick={() => window.location.href = `${apiUrl}/auth/google/callback`}
//           >
//             <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden>
//               <path
//                 d="M44.5 20H24v8.5h11.9C34.6 33 30.7 36 25.5 36c-6.3 0-11.5-5.2-11.5-11.5S19.2 13 25.5 13c3.1 0 5.9 1.1 8 3l6-6C36 6.1 30.9 3 25.5 3 12.3 3 1.9 13.4 1.9 26.6S12.3 50 25.5 50c13.2 0 23.6-10.4 23.6-23.4 0-1.6-.2-3.1-.6-4.6z"
//                 fill="#EA4335"
//               />
//             </svg>
//             <span className="text-sm text-[#0b1226]">Continue with Google</span>
//           </button> */}

//           {/* Divider */}
//           {/* <div className="flex items-center text-xs text-[#9aa3b2] my-4">
//             <div className="flex-1 h-px bg-[#eef2f6]" />
//             <div className="px-3">OR</div>
//             <div className="flex-1 h-px bg-[#eef2f6]" />
//           </div> */}

//           {/* Full Name */}
//           <div>
//             <label className="block text-sm font-medium text-[#475569] mb-1">Full Name</label>
//             <input
//               type="text"
//               placeholder="John Doe"
//               className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9] focus:border-transparent shadow-sm"
//               {...register("fullName")}
//             />
//             {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-[#475569] mb-1">Email</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9] focus:border-transparent shadow-sm"
//               {...register("email")}
//             />
//             {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-[#475569] mb-1">Password</label>
//             <PasswordInput register={register} name="password" />
//             {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
//           </div>

//           {/* Optional Fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-[#475569] mb-1">Phone Number</label>
//               <input
//                 type="text"
//                 placeholder="+3301XXXXXXXXX"
//                 className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9]"
//                 {...register("phoneNumber")}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-[#475569] mb-1">Country</label>
//               <input
//                 type="text"
//                 placeholder="France"
//                 className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9]"
//                 {...register("country")}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div>
//               <label className="block text-sm font-medium text-[#475569] mb-1">Date of Birth</label>
//               <input
//                 type="date"
//                 className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] focus:ring-2 focus:ring-[#e6eef9]"
//                 {...register("dateOfBirth")}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-[#475569] mb-1">Referral Code</label>
//               <input
//                 type="text"
//                 placeholder="Optional"
//                 className="w-full border rounded-md px-4 py-3 bg-[#fbfdff] placeholder-[#aab4c3] focus:ring-2 focus:ring-[#e6eef9]"
//                 {...register("referralCode")}
//               />
//             </div>
//           </div>

//           {/* Submit */}
//           <motion.button
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-xl text-white font-medium mt-4 shadow-[inset_0_-4px_0_rgba(0,0,0,0.12)] ${
//               loading ? "bg-[#101827] opacity-80 cursor-not-allowed" : "bg-[#0b1226] hover:brightness-105"
//             }`}
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </motion.button>

//           {/* Error Message */}
//           {errorMessage && <div className="mt-3 text-sm text-center text-red-600">{errorMessage}</div>}

//           <div className="text-sm text-[#6b7280] mt-4 text-center">
//             Already have an account?{" "}
//             <Link to="/login" className="text-[#0b1226] font-medium">
//               Sign in
//             </Link>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// }

import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import UploadField from './../components/common/UploadFile';

const schema = z.object({
  accountType: z.enum(['PERSONAL', 'BUSINESS']),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phoneNumber: z.string().optional(),
  companyName: z.string().optional(),
  legalForm: z.string().optional(),
  managerName: z.string().optional(),
  companyPhone: z.string().optional(),
  companyAddress: z.string().optional(),
  businessDescription: z.string().optional(),
  legalFormDocument: z.string().optional(),
});

export default function Register() {
  const [accountType, setAccountType] = useState('PERSONAL');
  const { register, handleSubmit, setValue, formState: { errors } } =
    useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/auth/register', data);
      alert('Registration submitted for approval!');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Account Type Toggle */}
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setAccountType('PERSONAL')}
          className={`px-4 py-2 rounded ${
            accountType === 'PERSONAL' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Personal
        </button>
        <button
          type="button"
          onClick={() => setAccountType('BUSINESS')}
          className={`px-4 py-2 rounded ${
            accountType === 'BUSINESS' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Business
        </button>
      </div>

      {/* Common Fields */}
      <div>
        <input {...register('email')} placeholder="Email" className="border p-2 w-full" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <input
          type="password"
          {...register('password')}
          placeholder="Password"
          className="border p-2 w-full"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {accountType === 'PERSONAL' && (
        <>
          <input {...register('firstName')} placeholder="First name" className="border p-2 w-full" />
          <input {...register('lastName')} placeholder="Last name" className="border p-2 w-full" />
          <input {...register('phoneNumber')} placeholder="Phone number" className="border p-2 w-full" />
        </>
      )}

      {accountType === 'BUSINESS' && (
        <>
          <input {...register('companyName')} placeholder="Company Name" className="border p-2 w-full" />
          <input {...register('legalForm')} placeholder="Legal Form" className="border p-2 w-full" />
          <input {...register('managerName')} placeholder="Manager Name" className="border p-2 w-full" />
          <input {...register('companyPhone')} placeholder="Company Phone" className="border p-2 w-full" />
          <input {...register('companyAddress')} placeholder="Company Address" className="border p-2 w-full" />
          <textarea {...register('businessDescription')} placeholder="Business Description" className="border p-2 w-full" />

          {/* File Upload Field */}
          <UploadField
            label="Legal Form Document"
            name="legalFormDocument"
            onUpload={(url) => setValue('legalFormDocument', url)}
            showPreview={false}
          />
        </>
      )}

      <button
        type="submit"
        className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700"
      >
        Register
      </button>
    </form>
  );
}

