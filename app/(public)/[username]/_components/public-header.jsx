import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, UserCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BorderBeam } from "@/components/ui/border-beam";

const PublicHeader = ({
  link,
  title,
  user,
  isFollowing,
  isOwnProfile,
  onToggleFollow,
  isLoading,
  bannerHeight = "h-28 md:h-36", // Default height for user profile page
}) => {
  return (
    <div className="w-full relative bg-black">
      {/* Banner Cover Area with integrated transparent Header floating on top */}
      <div className={`w-full bg-purple-600 relative ${bannerHeight}`}>
        {/* Floating Header Actions inside the banner */}
        <div className="absolute top-0 left-0 w-full px-6 md:px-12 py-5 flex items-center justify-between z-20">
          <Link href={link}>
            <Button
              size="sm"
              className="bg-transparent text-white hover:bg-transparent hover:opacity-85 transition-opacity cursor-pointer border-0 shadow-none"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {title}
            </Button>
          </Link>
          <Link href={"/"} className="flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Inkspire Logo"
              width={96}
              height={32}
              className="h-8 sm:h-10 md:h-11 w-auto object-contain drop-shadow-md"
            />
          </Link>
        </div>
      </div>

      {/* Profile Section overlapping the bottom border of the banner */}
      {user && (
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">

            {/* Profile Picture with BorderBeam effect */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-black bg-black shadow-2xl">
              {user.imageUrl ? (
                <Image
                  src={user.imageUrl}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full bg-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}

              {/* Animated Purple-to-Pink Border Beam for the Avatar */}
              <BorderBeam
                size={100}
                duration={5}
                colorFrom="#a855f7"
                colorTo="#ec4899"
              />
            </div>

            {/* Follow / Action Button with Dark Theme & BorderBeam */}
            {!isOwnProfile && onToggleFollow && (
              <Button
                onClick={onToggleFollow}
                disabled={isLoading}
                className={`relative overflow-hidden rounded-full px-6 cursor-pointer transition-all ${isFollowing
                  ? "bg-black text-slate-300 border border-white/10 hover:bg-zinc-900"
                  : "bg-black text-white border border-white/30 hover:bg-zinc-900"
                  }`}
              >
                {/* Border Beam effect using monochrome tones */}
                <BorderBeam
                  size={40}
                  duration={4}
                  colorFrom="#ffffff"
                  colorTo="#52525b"
                />

                {isFollowing ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2 relative z-10" />
                    <span className="relative z-10">Follow</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicHeader;