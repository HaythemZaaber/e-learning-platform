import React from "react";
import Image from "next/image";
import banner from "@/public/images/banner.png";
const HeroSection = () => {
  return (
    <div className="  text-black bg-accent/30">
      <div className="grid grid-cols-2 gap-5  items-center w-[90vw] mx-auto py-10">
        <div className="flex-1 flex flex-col gap-5 ">
          {/* hero section content for the right side */}

          <h2 className="leading-12 font-medium">
            Find Expert Teachers Worldwide for Every Passion and School Subject
            — Live or On Your Schedule.
          </h2>
          <h5 className="font-medium opacity-70 leading-9">
            From academic excellence to creative mastery, our AI helps match you
            with the right mentor.
          </h5>
          <button className="btn-primary rounded-md w-fit px-10 py-3 text-[15px] font-semibold cursor-pointer hover:bg-accent">
            Explore Courses
          </button>
          {/* <input type="text" className="input bg-primary" /> */}
        </div>
        <Image className="   " src={banner} alt="banner image" />
      </div>
    </div>
  );
};

export default HeroSection;
