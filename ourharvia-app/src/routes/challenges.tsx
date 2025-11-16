/** @format */

"use client";

import { useState } from "react";
import {
  Flame,
  Target,
  Users,
  Calendar,
  Trophy,
  Zap,
  ChevronRight,
  Lock,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Star,
  Heart,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import saunaImage from "../images/sauna4.jpg";

export const Route = createFileRoute("/challenges")({
  component: Challenges,
});

interface Challenge {
  id: string;
  type: "personal" | "1v1" | "group" | "community";
  title: string;
  description: string;
  progress: number;
  daysLeft: number;
  reward: { type: string; value: string };
  participants?: Array<{ name: string; initials: string }>;
  status: "active" | "available" | "completed";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  requirement?: string;
}

const allChallenges: Challenge[] = [
  {
    id: "1",
    type: "personal",
    title: "Heat Warrior",
    description: "Reach 80°C average temperature",
    progress: 65,
    daysLeft: 5,
    reward: { type: "badge", value: "50 XP" },
    status: "active",
    icon: Flame,
    color: "#ff6b5b",
    requirement: "Complete 5 sessions at 80°C+",
  },
  {
    id: "2",
    type: "1v1",
    title: "Weekly Showdown",
    description: "Compete against Jordan for total session time",
    progress: 72,
    daysLeft: 2,
    reward: { type: "trophy", value: "Crown Badge" },
    participants: [
      { name: "You", initials: "YOU" },
      { name: "Jordan", initials: "JOR" },
    ],
    status: "active",
    icon: Users,
    color: "#ffa500",
    requirement: "Most total minutes wins",
  },
  {
    id: "3",
    type: "personal",
    title: "Week Streak",
    description: "Sauna 7 days in a row",
    progress: 86,
    daysLeft: 1,
    reward: { type: "badge", value: "30 XP" },
    status: "active",
    icon: Calendar,
    color: "#4169e1",
    requirement: "Visit sauna daily for 7 days",
  },
  {
    id: "4",
    type: "group",
    title: "Squad Goals",
    description: "Your friend group's total minutes this month",
    progress: 42,
    daysLeft: 15,
    reward: { type: "badge", value: "100 XP" },
    participants: [
      { name: "Alex", initials: "AL" },
      { name: "Morgan", initials: "MO" },
      { name: "Casey", initials: "CA" },
    ],
    status: "active",
    icon: Trophy,
    color: "#ffd700",
    requirement: "Reach 500 combined minutes",
  },
  {
    id: "5",
    type: "personal",
    title: "Speedrunner",
    description: "10 sessions in one week",
    progress: 40,
    daysLeft: 7,
    reward: { type: "badge", value: "25 XP" },
    status: "available",
    icon: Zap,
    color: "#a78bfa",
    requirement: "Complete 10 sessions within 7 days",
  },
  {
    id: "6",
    type: "community",
    title: "Winter Endurance Challenge",
    description: "App-wide event - Total sauna minutes",
    progress: 28,
    daysLeft: 30,
    reward: { type: "badge", value: "200 XP" },
    status: "available",
    icon: Award,
    color: "#06b6d4",
    requirement: "Compete with 1000+ users",
  },
  {
    id: "7",
    type: "personal",
    title: "Recovery Pro",
    description: "Improve wellness score by 20 points",
    progress: 100,
    daysLeft: 0,
    reward: { type: "badge", value: "40 XP" },
    status: "completed",
    icon: Heart,
    color: "#ff69b4",
    requirement: "Session recovery metrics",
  },
  {
    id: "8",
    type: "group",
    title: "Consistency King",
    description: "14-day streak",
    progress: 100,
    daysLeft: 0,
    reward: { type: "badge", value: "60 XP" },
    participants: [
      { name: "Jesse", initials: "JH" },
      { name: "Ismael", initials: "IA" },
      { name: "Mahmud", initials: "MF" },
    ],
    status: "completed",
    icon: Star,
    color: "#34d399",
    requirement: "Maintain 14-day streak",
  },
];

export default function Challenges() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const tabs = [
    { id: "active", label: "Active", icon: Flame },
    { id: "available", label: "Available", icon: Target },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  const filteredChallenges = allChallenges.filter((c) => c.status === activeTab);

  const activeChallenges = allChallenges.filter((c) => c.status === "active");
  const activeChallengeCount = activeChallenges.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050507" }}>
      <div className="max-w-md mx-auto pb-8">
        {/* Hero Header */}
        <div className="relative w-full h-40 rounded-b-3xl overflow-hidden">
          <img src={saunaImage} alt="Challenges banner" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050507]" />
        </div>

        {/* Page Navigation Icons */}
        <div className="px-4 relative -mt-6 mb-8">
          <div className="flex justify-center gap-10">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all transform hover:scale-110"
                  style={{
                    backgroundColor: activeTab === tab.id ? "#c8102e" : "#1a1a1d",
                    border: `2px solid ${activeTab === tab.id ? "#c8102e" : "#333"}`,
                  }}
                >
                  <IconComponent className="w-6 h-6" style={{ color: activeTab === tab.id ? "#ffffff" : "#777" }} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Sections */}
        <div className="px-4 space-y-6">
          {/* Active Challenges Count Header */}
          {activeTab === "active" && (
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white">
                {activeChallengeCount} Active Challenge{activeChallengeCount !== 1 ? "s" : ""}
              </h1>
            </div>
          )}

          {activeTab === "available" && (
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white">Available Challenges</h1>
            </div>
          )}

          {activeTab === "completed" && (
            <div className="text-center">
              <h1 className="text-xl font-semibold text-white">Completed Challenges</h1>
            </div>
          )}

          {/* Challenge Cards */}
          {filteredChallenges.length > 0 ? (
            <div className="space-y-3">
              {filteredChallenges.map((challenge) => {
                const IconComponent = challenge.icon;
                return (
                  <button
                    key={challenge.id}
                    onClick={() => setSelectedChallenge(challenge)}
                    className="relative w-full text-left p-4 rounded-xl transition-all hover:scale-105"
                    style={{
                      backgroundColor: "#1a1a1d",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {/* Challenge Type Badge */}
                    <div
                      className="absolute top-4 right-12 px-2 py-0.5 text-[10px] font-semibold rounded-full"
                      style={{
                        backgroundColor: "#2a2a2d",
                        color: challenge.color,
                        border: `1px solid ${challenge.color}40`,
                      }}
                    >
                      {challenge.type.toUpperCase()}
                    </div>

                    <div className="flex gap-3">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: `${challenge.color}20`,
                        }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: challenge.color }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-white truncate">{challenge.title}</h3>
                        <p style={{ color: "#999" }} className="text-xs mt-0.5 line-clamp-1">
                          {challenge.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: "#2a2a2d" }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${challenge.progress}%`,
                                backgroundColor: challenge.color,
                              }}
                            />
                          </div>
                        </div>

                        {/* Meta */}
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs font-medium text-white">{challenge.progress}% complete</p>
                          {challenge.daysLeft > 0 && (
                            <p style={{ color: "#999" }} className="text-xs">
                              {challenge.daysLeft} days left
                            </p>
                          )}
                        </div>

                        {/* Participants */}
                        {challenge.participants && challenge.participants.length > 0 && (
                          <div className="flex gap-1 mt-2">
                            {challenge.participants.slice(0, 3).map((p, idx) => (
                              <div
                                key={idx}
                                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                                style={{
                                  backgroundColor: idx === 0 ? "#c8102e" : "#2a2a2d",
                                  border: "1px solid #1a1a1d",
                                }}
                              >
                                {p.initials[0]}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <ChevronRight className="w-5 h-5 self-center flex-shrink-0" style={{ color: "#777" }} />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-12 h-12 mx-auto mb-3" style={{ color: "#555" }} />
              <p className="text-white font-semibold">No challenges here yet</p>
              <p style={{ color: "#999" }} className="text-sm mt-1">
                {activeTab === "active" && "Ready for a challenge? Browse Available"}
                {activeTab === "available" && "Join one to get started!"}
                {activeTab === "completed" && "Complete challenges to see them here"}
              </p>
            </div>
          )}
        </div>

        {/* Challenge Detail Modal */}
        {selectedChallenge && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50"
            onClick={() => setSelectedChallenge(null)}
          >
            <div
              className="w-full rounded-t-3xl p-6"
              style={{ backgroundColor: "#1a1a1d" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${selectedChallenge.color}20`,
                  }}
                >
                  <selectedChallenge.icon className="w-8 h-8" style={{ color: selectedChallenge.color }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-white">{selectedChallenge.title}</h2>
                  <p style={{ color: "#999" }} className="text-sm mt-1">
                    {selectedChallenge.description}
                  </p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <p style={{ color: "#999" }} className="text-xs">
                    PROGRESS
                  </p>
                  <p className="text-sm font-semibold text-white">{selectedChallenge.progress}%</p>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: "#2a2a2d" }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${selectedChallenge.progress}%`,
                      backgroundColor: selectedChallenge.color,
                    }}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 mb-6 pb-4 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                {selectedChallenge.daysLeft > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" style={{ color: "#999" }} />
                      <span style={{ color: "#999" }} className="text-sm">
                        Time remaining
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{selectedChallenge.daysLeft} days</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" style={{ color: "#999" }} />
                    <span style={{ color: "#999" }} className="text-sm">
                      Reward
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-white">{selectedChallenge.reward.value}</p>
                </div>

                {selectedChallenge.requirement && (
                  <div>
                    <p style={{ color: "#999" }} className="text-xs mb-2">
                      REQUIREMENT
                    </p>
                    <p className="text-sm text-white">{selectedChallenge.requirement}</p>
                  </div>
                )}

                {selectedChallenge.participants && selectedChallenge.participants.length > 0 && (
                  <div>
                    <p style={{ color: "#999" }} className="text-xs mb-2">
                      PARTICIPANTS
                    </p>
                    <div className="flex gap-2">
                      {selectedChallenge.participants.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                          style={{
                            backgroundColor: idx === 0 ? "rgba(200, 16, 46, 0.2)" : "#2a2a2d",
                            color: idx === 0 ? "#c8102e" : "#999",
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              backgroundColor: idx === 0 ? "#c8102e" : "#555",
                              color: "white",
                            }}
                          >
                            {p.initials[0]}
                          </div>
                          {p.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {selectedChallenge.status === "active" && (
                  <>
                    <button
                      className="w-full py-3 rounded-lg font-medium transition-colors"
                      style={{ backgroundColor: "#c8102e", color: "white" }}
                    >
                      Continue Challenge
                    </button>
                    <button className="w-full py-2 text-sm transition-colors" style={{ color: "#999" }}>
                      Leave challenge
                    </button>
                  </>
                )}

                {selectedChallenge.status === "available" && (
                  <button
                    className="w-full py-3 rounded-lg font-medium transition-colors"
                    style={{ backgroundColor: "#c8102e", color: "white" }}
                  >
                    Join Challenge
                  </button>
                )}

                {selectedChallenge.status === "completed" && (
                  <div className="text-center py-3">
                    <p className="text-white font-semibold">You completed this! 🎉</p>
                  </div>
                )}

                <button
                  className="w-full py-2 rounded-lg text-sm"
                  style={{
                    backgroundColor: "transparent",
                    color: "#999",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                  onClick={() => setSelectedChallenge(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
