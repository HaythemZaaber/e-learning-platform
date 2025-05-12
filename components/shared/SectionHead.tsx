import React from "react";

const SectionHead: React.FC<{
  tag: string;
  title: string;
  subTitle?: string;
  desc?: string;
}> = ({ tag, title, subTitle, desc }) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full">
        {tag}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        {title} <span className="text-indigo-600">{subTitle}</span>
      </h2>
      {desc && <p className="text-gray-600">{desc}</p>}
    </div>
  );
};

export default SectionHead;
