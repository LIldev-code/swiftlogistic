"use client";
import React, { useContext, useState } from "react";
import style from "./page.module.css";
import { useRouter } from "next/navigation";
import ShipmentContext from "@/contexts/ShipmentContext";
import Image from "next/image";

function Page() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { setUser } = useContext(ShipmentContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) { setError("Username is required"); return; }
    if (!password) { setError("Password is required"); return; }
    try {
      setIsLoading(true);
      setError("");
      const response = await fetch("/api/auth/authentication", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.userData);
        localStorage.setItem("user", JSON.stringify(data.userData));
        if (data.token) localStorage.setItem("token", data.token);
        router.push("/admin");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: "fa-shipping-fast", text: "Real-time shipment tracking" },
    { icon: "fa-globe", text: "150+ countries covered" },
    { icon: "fa-shield-alt", text: "Secure & encrypted data" },
    { icon: "fa-headset", text: "24/7 support team" },
  ];

  return (
    <div className={style.page}>
      {/* LEFT panel */}
      <div className={style.left}>
        <div className={style.leftOverlay} />
        <img src="/images/pexels-tomfisk-1427107.jpg" alt="Logistics" className={style.leftBg} />
        <div className={style.leftContent}>
          <div className={style.brand}>
            <Image
              src="/images/swiftargo.png"
              alt="SwiftCargo"
              width={280}
              height={70}
              className={style.brandLogo}
            />
          </div>
          <h1 className={style.leftTitle}>
            Powering Global Logistics, One Shipment at a Time
          </h1>
          <p className={style.leftSub}>
            Log in to manage shipments, update statuses, and keep your customers informed in real time.
          </p>
          <div className={style.features}>
            {features.map((f, i) => (
              <div key={i} className={style.featureItem}>
                <div className={style.featureIcon}>
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div className={style.testimonial}>
            <p>&ldquo;SwiftCargo has transformed our shipping operations with their reliable tracking system.&rdquo;</p>
            <span>— John Smith, CEO of Global Trade Inc.</span>
          </div>
        </div>
      </div>

      {/* RIGHT panel */}
      <div className={style.right}>
        <div className={style.formBox}>
          <div className={style.formTop}>
            <div className={style.formIcon}>
              <i className="fas fa-lock"></i>
            </div>
            <h2 className={style.formTitle}>Admin Sign In</h2>
            <p className={style.formSub}>Enter your credentials to access the dashboard</p>
          </div>

          {error && (
            <div className={style.errorAlert}>
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.field}>
              <label>Username</label>
              <div className={style.inputWrap}>
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className={style.field}>
              <div className={style.labelRow}>
                <label>Password</label>
              </div>
              <div className={style.inputWrap}>
                <i className="fas fa-lock"></i>
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className={style.eyeBtn}
                  onClick={() => setShowPass(!showPass)}
                >
                  <i className={`fas ${showPass ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className={style.rememberRow}>
              <label className={style.checkLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className={style.checkInput}
                />
                <span className={style.checkBox}></span>
                Remember me
              </label>
            </div>

            <button type="submit" className={style.submitBtn} disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className={style.spinner}></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>

          <div className={style.secureNote}>
            <i className="fas fa-shield-alt"></i>
            256-bit SSL encrypted connection
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
