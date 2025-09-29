"use client";

import React from "react";

interface BreadcrumsProps {
  crums?: string[];
}

export default function Breadcrums({ crums = [] }: BreadcrumsProps) {
  const crumsItems = crums.map((crum: string, index) => (
    <div key={index} className="whitespace-nowrap flex gap-1 justify-center">
      <span className="text-xs py-1 px-2 bg-red-500 rounded-md">{crum}</span>
      {index + 1 < crums.length ? <span className="">&gt;</span> : null}
    </div>
  ));

  return <div className="flex gap-1">{crumsItems}</div>;
}
