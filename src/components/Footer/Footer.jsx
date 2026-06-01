"use client";
import Link from "next/link";
import React from "react";
import style from "./Footer.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Footer() {
  const year = new Date().getFullYear();
  const navigate = useRouter();
  return (
    <main class="footer">
      <div className="central">
        <footer>
          <div class="container">
            <div class="footer-top section">
              <div class="footer-brand">
                <div className={style.left} onClick={() => navigate.push("/")}>
                  <img
                    src="/images/swiftargo.png"
                    width={200}
                    height={64}
                    alt="SwiftCargo Logo"
                    className={style.logo}
                  />
                </div>
                <p class="footer-text">
                  SwiftCargo delivers fast, reliable and secure freight
                  solutions across the globe — by air, sea, and road.
                </p>

                <ul class="wrapper">
                  <li class="icon facebook">
                    <span class="tooltip">Facebook</span>
                    <svg
                      viewBox="0 0 320 512"
                      height="1.2em"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path>
                    </svg>
                  </li>
                  <li class="icon twitter">
                    <span class="tooltip">Twitter</span>
                    <svg
                      height="1.8em"
                      fill="currentColor"
                      viewBox="0 0 48 48"
                      xmlns="http://www.w3.org/2000/svg"
                      class="twitter"
                    >
                      <path d="M42,12.429c-1.323,0.586-2.746,0.977-4.247,1.162c1.526-0.906,2.7-2.351,3.251-4.058c-1.428,0.837-3.01,1.452-4.693,1.776C34.967,9.884,33.05,9,30.926,9c-4.08,0-7.387,3.278-7.387,7.32c0,0.572,0.067,1.129,0.193,1.67c-6.138-0.308-11.582-3.226-15.224-7.654c-0.64,1.082-1,2.349-1,3.686c0,2.541,1.301,4.778,3.285,6.096c-1.211-0.037-2.351-0.374-3.349-0.914c0,0.022,0,0.055,0,0.086c0,3.551,2.547,6.508,5.923,7.181c-0.617,0.169-1.269,0.263-1.941,0.263c-0.477,0-0.942-0.054-1.392-0.135c0.94,2.902,3.667,5.023,6.898,5.086c-2.528,1.96-5.712,3.134-9.174,3.134c-0.598,0-1.183-0.034-1.761-0.104C9.268,36.786,13.152,38,17.321,38c13.585,0,21.017-11.156,21.017-20.834c0-0.317-0.01-0.633-0.025-0.945C39.763,15.197,41.013,13.905,42,12.429"></path>
                    </svg>
                  </li>
                  <li class="icon instagram">
                    <span class="tooltip">Whatsapp</span>
                    <i
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                      }}
                      class="fa-brands fa-whatsapp"
                      aria-hidden="true"
                    ></i>
                  </li>
                </ul>
              </div>

              <ul class="footer-list">
                <li>
                  <p class="footer-list-title">Quick Links</p>
                </li>

                <li>
                  <Link href="/about" class="footer-link">
                    About
                  </Link>
                </li>

                <li>
                  <Link href="/#service" class="footer-link">
                    Services
                  </Link>
                </li>

                <li>
                  <Link href="#" class="footer-link">
                    Blog
                  </Link>
                </li>

                <li>
                  <Link href="/contact" class="footer-link">
                    Contact Us
                  </Link>
                </li>
              </ul>

              <ul class="footer-list">
                <li>
                  <p class="footer-list-title">Services</p>
                </li>

                <li>
                  <Link href="/warehouse" class="footer-link">
                    Warehouse
                  </Link>
                </li>

                <li>
                  <Link href="/#service" class="footer-link">
                    Air Freight
                  </Link>
                </li>

                <li>
                  <Link href="/#service" class="footer-link">
                    Ocean Freight
                  </Link>
                </li>

                <li>
                  <Link href="/#service" class="footer-link">
                    Road Freight
                  </Link>
                </li>

                <li>
                  <Link href="/#service" class="footer-link">
                    Packaging
                  </Link>
                </li>
              </ul>

              <ul class="footer-list">
                <li>
                  <p class="footer-list-title">Community</p>
                </li>

                <li>
                  <Link href="#" class="footer-link">
                    Testimonials
                  </Link>
                </li>

                <li>
                  <Link href="#" class="footer-link">
                    Track Your Shipment
                  </Link>
                </li>

                <li>
                  <Link href="#" class="footer-link">
                    Privacy Policy
                  </Link>
                </li>

                <li>
                  <Link href="#" class="footer-link">
                    Terms & Condition
                  </Link>
                </li>
              </ul>
            </div>

            <div class="footer-bottom">
              <p class="copyright">
                &copy; {year} SwiftCargo. All Rights Reserved
                <Link href="#" class="copyright-link"></Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Footer;
