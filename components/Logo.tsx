import React from "react"

export default function Logo({ classes }: { classes: string }) {
  return (
    <div className={classes}>
      <img
        src="livespins-logo.png"
        alt="Live Spins Logo"
        className="w-[300px] sm:mt-10 sm:mb-6 md:-ml-10"
      />
    </div>
  )
}
