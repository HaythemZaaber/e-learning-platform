"use client";
import React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (scrollPosition >= viewportHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={cn(
        "w-full z-50 text-black bg-accent/10",
        isSticky ? "sticky top-0 bg-white shadow-sm" : "relative"
      )}
    >
      <div className=" w-[90vw] mx-auto  py-3 ">
        <div className="flex justify-between ">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold text-2xl">ELearning</div>
            <div className="hidden md:block ml-10">
              <ul className="flex space-x-8">
                <li>
                  <a href="#" className="hover:text-accent">
                    Become a teacher
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Find Teacher
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent">
                    Group Class
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-center">
            <div className="p-4 mx-5 overflow-hidden w-[45px] h-[45px] hover:w-[270px] bg-gradient-to-r from-primary to-secondary shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300">
              <div className="flex items-center justify-center fill-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Isolation_Mode"
                  data-name="Isolation Mode"
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                >
                  <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"></path>
                </svg>
              </div>
              <input
                placeholder="Search for courses"
                type="text"
                className="outline-none text-[15px] bg-transparent w-full text-white font-normal px-4"
              />
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
