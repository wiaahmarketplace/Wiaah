"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/optimized-image";

interface BlockedUser {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export default function BlocklistPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([
    {
      id: "1",
      name: "user-0",
      username: "user-0",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "2",
      name: "user-1",
      username: "user-1",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "3",
      name: "user-2",
      username: "user-2",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "4",
      name: "user-3",
      username: "user-3",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "5",
      name: "user-4",
      username: "user-4",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "6",
      name: "user-5",
      username: "user-5",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
    {
      id: "7",
      name: "user-6",
      username: "user-6",
      avatar: "https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=100",
    },
  ]);

  const handleUnblock = (userId: string, username: string) => {
    setBlockedUsers((prev) => prev.filter((user) => user.id !== userId));
    toast({
      title: "User Unblocked",
      description: `@${username} has been unblocked`,
    });
  };

  const filteredUsers = blockedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Block List</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search blocked users"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-14 bg-gray-50 border-gray-200 text-base"
                />
              </div>
            </div>

            {/* Blocked Users List */}
            <div className="space-y-0">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-6 border-b border-gray-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <OptimizedImage
                          src={user.avatar}
                          alt={user.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">@{user.username}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleUnblock(user.id, user.username)}
                      variant="outline"
                      className="border-gray-300 hover:bg-gray-100 text-gray-900 font-semibold px-6"
                    >
                      Unblock
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-base">
                    {searchQuery
                      ? "No users found matching your search"
                      : "You haven't blocked any users"}
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            {blockedUsers.length > 0 && (
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      About Blocking Users
                    </h4>
                    <p className="text-sm text-gray-600">
                      Blocked users cannot see your profile, send you messages, or interact with
                      your content. You can unblock them at any time.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
