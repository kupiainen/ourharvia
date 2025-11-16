/** @format */

"use client";

import { useState, useEffect } from "react";
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

export default function Challenges() {
  const [activeTab, setActiveTab] = useState("active");
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  function classifyChallenge(startDate, endDate) {
    const now = new Date();
  
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Compare using timestamps only
    if (start.getTime() > now.getTime()) return "not_started";
    if (end.getTime() < now.getTime()) return "completed";
    return "active";
  }
  
  useEffect(() => {
    async function loadChallenges() {
      try {
        // 1. Fetch all challenges (static list)
        const baseRes = await fetch(
          "https://ourharvia-1.onrender.com/challenges/get_challenges"
        );
        const baseData = await baseRes.json();
  
        if (!Array.isArray(baseData.challenges)) {
          console.error("Backend did NOT return challenges array:", baseData);
          setChallenges([]);
          return;
        }
  
        // 2. Fetch user progress
        const userRes = await fetch(
          "https://ourharvia-1.onrender.com/challenges/get_challenges/4169d4ca-ca75-4122-8d9e-cd88de0721d2"
        );
        const userData = await userRes.json();
  
        const userProgressArray = Array.isArray(userData.data)
          ? userData.data
          : [];
  
        console.log("User progress array:", userProgressArray);
  
        // Convert array into fast lookup map
        const progressMap = {};
        userProgressArray.forEach((p) => {
          progressMap[p.challenge_id] = p;
        });
  
        // 3. Build final challenge objects
        const mapped = baseData.challenges.map((c) => {
          const user = progressMap[c.id]; // match backend challenge.id
  
          const status = user?.is_completed
            ? "completed"
            : classifyChallenge(c.start_date, c.end_date);
  
          return {
            id: c.id,
            title: c.title,
            description: c.description,
            type: c.challenge_type,
            progress: user?.completion_percent ?? 0,
            daysLeft: calcDaysLeft(c.start_date, c.end_date),
            reward: {
              type: "points",
              value: `${c.reward_points} XP`,
            },
            status,
            icon: getChallengeIcon(c.challenge_type),
            color: getColorForDifficulty(c.difficulty_level),
            requirement: formatRequirement(c),
            badge_icon_url: c.badge_icon_url ?? c.badge_url,
            difficulty: c.difficulty_level,
          };
        });
  
        setChallenges(mapped);
      } catch (err) {
        console.error("Failed to load challenges:", err);
      } finally {
        setLoading(false);
      }
    }
  
    loadChallenges();
  }, []);
  
  const tabs = [
    { id: "active", label: "Active", icon: Flame },
    { id: "not_started", label: "Not Started", icon: Clock },
    { id: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  const filteredChallenges = challenges.filter((c) => c.status === activeTab);
  const activeChallenges = challenges.filter((c) => c.status === "active");
  const activeChallengeCount = activeChallenges.length;

  function calcDaysLeft(startDate: string, endDate: string) {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
  
    // Starts in the future
    if (start > now) {
      const diff = start.getTime() - now.getTime();
      return { type: "starts_in", days: Math.ceil(diff / (1000 * 60 * 60 * 24)) };
    }
  
    // Already active → time left
    const diff = end.getTime() - now.getTime();
    return { type: "ends_in", days: Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))) };
  }  
  
  function getChallengeIcon(type: string) {
    switch (type) {
      case "personal": return Flame;
      case "1v1": return Users;
      case "group": return Trophy;
      case "community": return Award;
      default: return Target;
    }
  }
  
  function getColorForDifficulty(level: string) {
    switch (level) {
      case "easy": return "#34d399";   // green
      case "medium": return "#ffa500"; // orange
      case "hard": return "#c8102e";   // red
      default: return "#999";
    }
  }
  
  function formatRequirement(c) {
    if (c.target_sessions) return `${c.target_sessions} sessions required`;
    if (c.target_duration_minutes) return `${c.target_duration_minutes} min of sauna total`;
    if (c.target_temperature) return `${c.target_temperature}°C target`;
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading challenges...
      </div>
    );
  }
  
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
                <IconComponent
                    className="w-6 h-6"
                    style={{ color: activeTab === tab.id ? "#ffffff" : "#777" }}
                />
                </button>
            );
            })}
        </div>
        </div>

        {/* Challenge Cards */}
        {filteredChallenges.length > 0 ? (
        <div className="space-y-3">
            {filteredChallenges.map((challenge) => (
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
                {/* Badge Image */}
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: `${challenge.color}20` }}
                >
                    <img
                    src={challenge.badge_icon_url}
                    alt={challenge.title}
                    className="w-full h-full object-contain p-1"
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">
                    {challenge.title} - {challenge.difficulty}
                    </h3>

                    <p style={{ color: "#999" }} className="text-xs mt-0.5 line-clamp-1">
                    {challenge.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-2">
                    <div
                        className="w-full h-1.5 rounded-full"
                        style={{ backgroundColor: "#2a2a2d" }}
                    >
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
                    <p className="text-xs font-medium text-white">
                        {challenge.progress}% complete
                    </p>
                    {challenge.daysLeft.days > 0 && (
                    <p style={{ color: "#999" }} className="text-xs">
                        {challenge.daysLeft.type === "starts_in"
                        ? `Starts in ${challenge.daysLeft.days} days`
                        : `${challenge.daysLeft.days} days left`}
                    </p>
                    )}
                    </div>
                </div>

                {/* Arrow */}
                <ChevronRight
                    className="w-5 h-5 self-center flex-shrink-0"
                    style={{ color: "#777" }}
                />
                </div>
            </button>
            ))}
        </div>
        ) : (
        <div className="text-center py-12">
            <Target className="w-12 h-12 mx-auto mb-3" style={{ color: "#555" }} />
            <p className="text-white font-semibold">No challenges here yet</p>
            <p style={{ color: "#999" }} className="text-sm mt-1">
            {activeTab === "active" && "Ready for a challenge? Browse Available"}
            {activeTab === "not_started" && "Join one to get started!"}
            {activeTab === "completed" && "Complete challenges to see them here"}
            </p>
        </div>
        )}
        

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
                  <div
                className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
                style={{ backgroundColor: `${selectedChallenge.color}20` }}
                >
                <img
                    src={selectedChallenge.badge_icon_url}
                    alt={selectedChallenge.title}
                    className="w-full h-full object-contain p-2"
                />
                </div>

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
              {selectedChallenge.daysLeft.days > 0 && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" style={{ color: "#999" }} />
                    <span style={{ color: "#999" }} className="text-sm">
                        {selectedChallenge.daysLeft.type === "starts_in"
                        ? "Starts in"
                        : "Time remaining"}
                    </span>
                    </div>
                    <p className="text-sm font-semibold text-white">
                    {selectedChallenge.daysLeft.days} days
                    </p>
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
