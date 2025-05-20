import React from "react";
import { Badge } from "../ui/badge";
import { Sparkles } from "lucide-react";

const SectionHead: React.FC<{
  tag: string;
  title: string;
  subTitle?: string;
  desc?: string;
}> = ({ tag, title, subTitle, desc }) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      {/* <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
        {tag}
      </span> */}
      <Badge
        variant="outline"
        className="mb-4 py-1 px-4 bg-indigo-100 text-indigo-800 border-indigo-200"
      >
        {" "}
        {tag}
      </Badge>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {title} <br /> <span className="text-indigo-600">{subTitle}</span>
      </h2>
      {desc && <p className="text-gray-600 text-lg">{desc}</p>}
    </div>
  );
};

export default SectionHead;
