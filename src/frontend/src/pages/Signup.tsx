import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";
import { Bird, CheckCircle, Eye, EyeOff, X } from "lucide-react";
import { useState } from "react";

type Props = { open: boolean; onClose: () => void };

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu & Kashmir",
  "Ladakh",
  "Chandigarh",
  "Puducherry",
];

type FormData = {
  fullName: string;
  mobileNumber: string;
  email: string;
  farmName: string;
  state: string;
  city: string;
  role: "Farmer" | "Dealer" | "Company" | "";
  birdCapacity: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function Signup({ open, onClose }: Props) {
  const [form, setForm] = useState<FormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    farmName: "",
    state: "",
    city: "",
    role: "",
    birdCapacity: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.mobileNumber.trim() || !/^\d{10}$/.test(form.mobileNumber.trim()))
      e.mobileNumber = "Enter a valid 10-digit mobile number";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.farmName.trim()) e.farmName = "Farm name is required";
    if (!form.state) e.state = "Please select a state";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.role) e.role = "Please select a role";
    const cap = Number.parseInt(form.birdCapacity, 10);
    if (!form.birdCapacity || Number.isNaN(cap) || cap <= 0)
      e.birdCapacity = "Enter a valid positive bird capacity";
    if (!form.password || form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    storage.addSignupRequest({
      fullName: form.fullName.trim(),
      mobileNumber: form.mobileNumber.trim(),
      email: form.email.trim(),
      farmName: form.farmName.trim(),
      state: form.state,
      city: form.city.trim(),
      role: form.role as "Farmer" | "Dealer" | "Company",
      birdCapacity: Number.parseInt(form.birdCapacity, 10),
      password: form.password,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({
      fullName: "",
      mobileNumber: "",
      email: "",
      farmName: "",
      state: "",
      city: "",
      role: "",
      birdCapacity: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    onClose();
  };

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close signup"
        className="fixed inset-0 z-40 w-full h-full cursor-default"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={handleClose}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative pointer-events-auto max-h-[90vh] flex flex-col"
          style={{ animation: "loginModalIn 0.25s ease-out both" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 pt-7 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                }}
              >
                <Bird size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Create Account
                </h2>
                <p className="text-xs text-gray-500">Sign up for Poultrix</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              aria-label="Close signup"
              data-ocid="signup.close_button"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1 px-8 py-5">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle size={36} className="text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Request Submitted!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
                  Your signup request has been submitted! Admin will review and
                  approve your account. You'll receive your login credentials
                  once approved.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-2.5 rounded-xl transition-colors"
                  data-ocid="signup.close_button"
                >
                  Close
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="signup.modal"
              >
                {/* Full Name */}
                <div className="space-y-1">
                  <Label
                    htmlFor="s-fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="s-fullName"
                    value={form.fullName}
                    onChange={(e) => set("fullName", e.target.value)}
                    placeholder="Enter your full name"
                    className="h-9 border-gray-200 focus:border-green-500"
                    data-ocid="signup.input"
                  />
                  {errors.fullName && (
                    <p
                      className="text-red-500 text-xs"
                      data-ocid="signup.error_state"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Mobile */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="s-mobile"
                      className="text-sm font-medium text-gray-700"
                    >
                      Mobile Number
                    </Label>
                    <Input
                      id="s-mobile"
                      value={form.mobileNumber}
                      onChange={(e) => set("mobileNumber", e.target.value)}
                      placeholder="10-digit mobile"
                      className="h-9 border-gray-200 focus:border-green-500"
                      data-ocid="signup.input"
                    />
                    {errors.mobileNumber && (
                      <p
                        className="text-red-500 text-xs"
                        data-ocid="signup.error_state"
                      >
                        {errors.mobileNumber}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="s-email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="s-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com"
                      className="h-9 border-gray-200 focus:border-green-500"
                      data-ocid="signup.input"
                    />
                    {errors.email && (
                      <p
                        className="text-red-500 text-xs"
                        data-ocid="signup.error_state"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Farm Name */}
                <div className="space-y-1">
                  <Label
                    htmlFor="s-farmName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Farm Name
                  </Label>
                  <Input
                    id="s-farmName"
                    value={form.farmName}
                    onChange={(e) => set("farmName", e.target.value)}
                    placeholder="Enter farm name"
                    className="h-9 border-gray-200 focus:border-green-500"
                    data-ocid="signup.input"
                  />
                  {errors.farmName && (
                    <p
                      className="text-red-500 text-xs"
                      data-ocid="signup.error_state"
                    >
                      {errors.farmName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* State */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="s-state"
                      className="text-sm font-medium text-gray-700"
                    >
                      State
                    </Label>
                    <select
                      id="s-state"
                      value={form.state}
                      onChange={(e) => set("state", e.target.value)}
                      className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-500 bg-white"
                      data-ocid="signup.select"
                    >
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p
                        className="text-red-500 text-xs"
                        data-ocid="signup.error_state"
                      >
                        {errors.state}
                      </p>
                    )}
                  </div>

                  {/* City */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="s-city"
                      className="text-sm font-medium text-gray-700"
                    >
                      City
                    </Label>
                    <Input
                      id="s-city"
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="Enter city"
                      className="h-9 border-gray-200 focus:border-green-500"
                      data-ocid="signup.input"
                    />
                    {errors.city && (
                      <p
                        className="text-red-500 text-xs"
                        data-ocid="signup.error_state"
                      >
                        {errors.city}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Role */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="s-role"
                      className="text-sm font-medium text-gray-700"
                    >
                      Role
                    </Label>
                    <select
                      id="s-role"
                      value={form.role}
                      onChange={(e) => set("role", e.target.value)}
                      className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm focus:outline-none focus:border-green-500 bg-white"
                      data-ocid="signup.select"
                    >
                      <option value="">Select role</option>
                      <option value="Farmer">Farmer</option>
                      <option value="Dealer">Dealer</option>
                      <option value="Company">Company</option>
                    </select>
                    {errors.role && (
                      <p
                        className="text-red-500 text-xs"
                        data-ocid="signup.error_state"
                      >
                        {errors.role}
                      </p>
                    )}
                  </div>

                  {/* Bird Capacity */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="s-birds"
                      className="text-sm font-medium text-gray-700"
                    >
                      Bird Capacity
                    </Label>
                    <Input
                      id="s-birds"
                      type="number"
                      min="1"
                      value={form.birdCapacity}
                      onChange={(e) => set("birdCapacity", e.target.value)}
                      placeholder="e.g. 5000"
                      className="h-9 border-gray-200 focus:border-green-500"
                      data-ocid="signup.input"
                    />
                    {errors.birdCapacity && (
                      <p
                        className="text-red-500 text-xs"
                        data-ocid="signup.error_state"
                      >
                        {errors.birdCapacity}
                      </p>
                    )}
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <Label
                    htmlFor="s-password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="s-password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                      placeholder="Min 6 characters"
                      className="h-9 pr-10 border-gray-200 focus:border-green-500"
                      data-ocid="signup.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      className="text-red-500 text-xs"
                      data-ocid="signup.error_state"
                    >
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1">
                  <Label
                    htmlFor="s-confirm"
                    className="text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="s-confirm"
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => set("confirmPassword", e.target.value)}
                      placeholder="Re-enter password"
                      className="h-9 pr-10 border-gray-200 focus:border-green-500"
                      data-ocid="signup.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p
                      className="text-red-500 text-xs"
                      data-ocid="signup.error_state"
                    >
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 font-semibold text-white mt-2"
                  style={{
                    background: "linear-gradient(135deg, #16a34a, #15803d)",
                  }}
                  data-ocid="signup.submit_button"
                >
                  Submit Request
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
