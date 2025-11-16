'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Flame, Wind, Zap, Trophy, Medal, Target, Clock, TrendingUp, Heart, Smile } from 'lucide-react'
import { createFileRoute } from '@tanstack/react-router'
import saunaImage from '../images/sauna3.jpg'

export const Route = createFileRoute('/scoreboard')({
  component: RouteComponent,
})

/* --- Data Interfaces & Static Data --- */

interface AchievementBadge {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  earned: boolean
  progress: number
  description: string
  howToAchieve: string
}

function RouteComponent() {
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [timeFilter, setTimeFilter] = useState("week");
    const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
    const [currentTab, setCurrentTab] = useState("1v1");
    const [sortBy, setSortBy] = useState("time");
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
  
    // TEMP – replace later with auth
    const CURRENT_USER_ID = "a9514cc2-a619-4d46-9c02-0fa0804d8d6e";
  
    /* -----------------------------
        Load All Users From Backend
    ------------------------------*/
    useEffect(() => {
      async function loadUsers() {
        try {
          const res = await fetch("https://ourharvia-1.onrender.com/users/user_stats_all");
          const data = await res.json();
          console.log(data)
  
          // Convert backend → frontend structure
          const mapped = data.map((u: any, index: number) => ({
            id: u.user_id,
            name: u.full_name ?? "Unknown User",
            initials:
              (u.full_name?.split(" ").map((x: string) => x[0]).join("") || "UU").toUpperCase(),
            avatar: "",
            totalSessions: u.total_sessions ?? 0,
            totalTime: u.total_time_minutes ?? 0,
            avgTemp: u.average_temperature ?? 0,
            avgDuration: u.average_duration_minutes ?? 0,
            badgesEarned: u.badges_earned ?? 0, // backend may add later
            rank: index + 1,
            raw: u,
          }));
  
          setUsers(mapped);
  
          // Pre-select first opponent (NOT the current user)
          const firstOpponent = mapped.find((u) => u.id !== CURRENT_USER_ID);
          setSelectedFriend(firstOpponent ?? null);
  
        } catch (err) {
          console.error("Failed to load users:", err);
        } finally {
          setLoading(false);
        }
      }
  
      loadUsers();
    }, []);
  
    /* -----------------------------
          Current User Data
    ------------------------------*/
    const currentUser = users.find((u) => u.id === CURRENT_USER_ID);
  
    if (!currentUser || loading) {
      return <div className="text-white p-6">Loading...</div>;
    }
  
    /* -----------------------------
          Opponents (All Except You)
    ------------------------------*/
    const opponents = users.filter((u) => u.id !== CURRENT_USER_ID);
  
    /* -----------------------------
          Friend Stats (Selected Opponent)
    ------------------------------*/
    const friendStats = selectedFriend
      ? {
          totalSessions: selectedFriend.totalSessions,
          avgDuration: selectedFriend.avgDuration,
          avgTemp: selectedFriend.avgTemp,
          avgHumidity: selectedFriend.raw?.average_humidity ?? 0,
          longestSession: selectedFriend.raw?.longest_session_minutes ?? 0,
          thisWeek: 0, // backend doesn't track yet
        }
      : null;
  
    /* -----------------------------
           Sorted Leaderboard
    ------------------------------*/
    const sortedLeaderboard = [...users]
      .sort((a, b) => {
        switch (sortBy) {
          case "temp":
            return b.avgTemp - a.avgTemp;
          case "badges":
            return b.badgesEarned - a.badgesEarned;
          default:
            return b.totalTime - a.totalTime; // "time"
        }
      })
      .map((u, index) => ({ ...u, rank: index + 1 }));
  
    /* -----------------------------
            Static Social Stats
    ------------------------------*/

    /* -----------------------------
      GENERATED SOCIAL STATS
------------------------------*/
function generateSocialStats(users: any[]) {
    if (!users.length) return [];
  
    // Helper to find user with max value in field
    const maxUser = (field: string) =>
      users.reduce((a, b) => (b[field] > a[field] ? b : a));
  
    const topTemp = maxUser("avgTemp");
    const topSessions = maxUser("totalSessions");
    const topMinutes = maxUser("totalTime");
    const topDuration = maxUser("avgDuration");
    const topStreak = maxUser("raw")?.raw?.longest_streak_days
      ? users.reduce((a, b) =>
          (b.raw?.longest_streak_days ?? 0) >
          (a.raw?.longest_streak_days ?? 0)
            ? b
            : a
        )
      : null;
  
    return [
      {
        title: "Heat Lover",
        name: topTemp.name,
        initials: topTemp.initials,
        stat: `${topTemp.avgTemp}°C avg temp`,
        icon: <Flame className="w-8 h-8" />,
      },
      {
        title: "Session Beast",
        name: topSessions.name,
        initials: topSessions.initials,
        stat: `${topSessions.totalSessions} total sessions`,
        icon: <Trophy className="w-8 h-8" />,
      },
      {
        title: "Time Machine",
        name: topMinutes.name,
        initials: topMinutes.initials,
        stat: `${topMinutes.totalTime} min spent`,
        icon: <Clock className="w-8 h-8" />,
      },
      {
        title: "Slow Burner",
        name: topDuration.name,
        initials: topDuration.initials,
        stat: `${topDuration.avgDuration} min avg duration`,
        icon: <Zap className="w-8 h-8" />,
      },
      topStreak && {
        title: "Streak King",
        name: topStreak.name,
        initials: topStreak.initials,
        stat: `${topStreak.raw?.longest_streak_days ?? 0} day streak`,
        icon: <TrendingUp className="w-8 h-8" />,
      },
    ].filter(Boolean); // remove nulls
  }

  const socialStats = generateSocialStats(users);

  return (
    <div className="min-h-screen bg-[#050507] text-foreground">
      
        {/* Top Hero Image */}
        <div className="relative w-full h-48 rounded-b-3xl overflow-hidden">
        <div className="relative w-full h-40 rounded-b-3xl overflow-hidden" style={{opacity:"0.6"}}>
            <img src={saunaImage} className="w-full h-full object-cover opacity-70" />
        </div>
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">Scoreboard</h1>
        </div>
        </div>

        {/* Circular Page Navigation */}
        <div className="flex justify-center gap-10 -mt-18 mb-0 relative z-20 ml-4 mr-4">
        {[
            { tab: "1v1", icon: <Flame className="w-6 h-6" />, label: "1v1", id: "tab-1v1" },
            { tab: "leaderboard", icon: <Trophy className="w-6 h-6" />, label: "Ranks", id: "tab-leaderboard" },
            // { tab: "badges", id:"tab-badges", icon: <Medal className="w-6 h-6" />, label: "Badges" },
            { tab: "social", icon: <Smile className="w-6 h-6" />, label: "Social", id: "tab-social" },
        ].map((item) => {
            const active = currentTab === item.tab
            return (
            <button
                key={item.tab}
                onClick={() => {
                document.getElementById(item.id)?.click()
                setCurrentTab(item.tab)
                }}
                className={`
                w-20 h-20 rounded-full flex flex-col items-center justify-center
                border shadow-lg backdrop-blur-md
                ${active ? "border-[#e58b0d] bg-[#e58b0d]/10" : "border-white/20 bg-[#1a1a1e]/80"}
                `}
            >
                <div className={`transition-colors ${active ? "text-[#e58b0d]" : "text-white"}`}>
                {item.icon}
                </div>
                <span
                className={`text-xs mt-1 transition-colors ${
                    active ? "text-[#e58b0d]" : "text-white"
                }`}
                >
                {item.label}
                </span>
            </button>
            )
        })}
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">


        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        {/* 1v1 Tab */}
        <TabsContent value="1v1" className="space-y-4 mt-4">
        <div className="flex flex-col md:flex-row gap-4">

            {/* Friend Selector */}
            <Card className="md:w-1/4 bg-[#1a1ad]/80 border border-[#2b2b2f] text-white">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Select Opponent</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5">
              {opponents.map((friend) => (
                <Button
                    key={friend.id}
                    variant="ghost"
                    onClick={() => setSelectedFriend(friend)}
                    className={`
                    w-full justify-start gap-3 rounded-lg border
                    ${
                        selectedFriend?.id === friend.id
                        ? "border-[#e58b0d] bg-[#e58b0d]/10"
                        : "border-transparent hover:bg-[#2b2b2f]"
                    }
                    `}
                >
                    <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#e58b0d] text-black text-xs font-bold">
                        {friend.initials}
                    </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{friend.name}</span>
                </Button>
                ))}
            </CardContent>
            </Card>

            {/* Comparison Section */}
            <div className="flex-1 space-y-4">

            {/* User Cards */}
            <div className="grid grid-cols-2 gap-4">
                
                {/* User */}
                <Card className="bg-gradient-to-br from-[#e58b0d]/15 to-[#1a1a1d] border border-[#e58b0d]/30">
                <CardContent className="pt-4 pb-4">
                    <div className="text-center">
                    <Avatar className="w-14 h-14 mx-auto mb-2">
                        <AvatarFallback className="bg-[#e58b0d] text-black font-bold">
                        {currentUser.initials}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-white">{currentUser.name}</h3>
                    <p className="text-xs text-[#e58b0d] mt-0.5">You</p>
                    </div>
                </CardContent>
                </Card>

                {/* Friend */}
                <Card className="bg-gradient-to-br from-blue-500/15 to-[#1a1a1d] border border-blue-500/30">
                <CardContent className="pt-4 pb-4">
                    <div className="text-center">
                    <Avatar className="w-14 h-14 mx-auto mb-2">
                        <AvatarFallback className="bg-blue-500 text-white font-bold">
                        {selectedFriend.initials}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-white">{selectedFriend.name}</h3>
                    <p className="text-xs text-blue-500 mt-0.5">Opponent</p>
                    {/* <p
                        className={`text-xs font-bold mt-0.5 ${
                        selectedFriend.wins > selectedFriend.losses
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                    >
                        {selectedFriend.wins}W - {selectedFriend.losses}L
                    </p> */}
                    </div>
                </CardContent>
                </Card>
            </div>

            {/* Stats */}
            <Card className="bg-[#1a1a1d]/80 border border-[#2b2b2f]">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Head-to-Head Stats</CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
            {[
            {
                label: "Total Sessions",
                your: currentUser.totalSessions,
                friend: friendStats.totalSessions,
            },
            // {
            //     label: "Total Time (min)",
            //     your: currentUser.totalTime,
            //     friend: friendStats.totalTime,
            // },
            {
                label: "Avg Temperature (°C)",
                your: currentUser.avgTemp,
                friend: friendStats.avgTemp,
            },
            {
                label: "Avg Duration (min)",
                your: currentUser.avgDuration,
                friend: friendStats.avgDuration,
            },
            {
                label: "Longest Streak (days)",
                your: currentUser.raw.longest_streak_days ?? 0,
                friend: selectedFriend.raw?.longest_streak_days ?? 0,
            },
            ].map((stat, idx) => {
            const yourIsBigger = stat.your > stat.friend;
            return (
                <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-[#2b2b2f]/60"
                >
                <span className="text-sm text-white/60">{stat.label}</span>

                <div className="flex gap-6">
                    <span
                    className={`
                        text-[#e58b0d]
                        ${yourIsBigger ? "font-bold" : "font-normal"}
                    `}
                    >
                    {stat.your}
                    </span>

                    <span
                    className={`
                        text-blue-400
                        ${!yourIsBigger ? "font-bold" : "font-normal"}
                    `}
                    >
                    {stat.friend}
                    </span>
                </div>
                </div>
            );
            })}
            </CardContent>
            </Card>

            {/* Graph Preview */}
            {/* <Card className="bg-[#1a1a1d]/80 border border-[#2b2b2f]">
                <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Session Graphs</CardTitle>
                </CardHeader>

                <CardContent>
                <div className="h-40 bg-[#2b2b2f]/60 rounded-md flex items-center justify-center text-white/40">
                    Graph visualization coming soon
                </div>
                </CardContent>
            </Card> */}
            </div>
        </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6 mt-6">

        {/* Filters */}
        <div className="flex gap-4 mb-4">

            {/* Timeframe Select */}
            <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-44 bg-[#1a1a1d] border border-[#2b2b2f] text-white">
                <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1d] border border-[#2b2b2f] text-white">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="alltime">All Time</SelectItem>
            </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
            <SelectTrigger className="w-44 bg-[#1a1a1d] border border-[#2b2b2f] text-white">
                <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1d] border border-[#2b2b2f] text-white">
                <SelectItem value="time">Total Time</SelectItem>
                <SelectItem value="temp">Avg Temp</SelectItem>
            </SelectContent>
            </Select>

        </div>

        {/* Leaderboard Table */}
        <Card className="bg-[#1a1a1d]/90 border border-[#2b2b2f] rounded-xl max-w-3xl mx-auto shadow-lg">
            <CardContent className="p-0">
            <div className="overflow-x-auto">

                <table className="w-full text-white">
                <thead>
                    <tr className="border-b border-[#2b2b2f] bg-[#232326]">
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/70 w-12">Rank</th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-white/70">User</th>

                    <th className={`px-2 py-2 text-left text-xs font-semibold whitespace-nowrap 
                        ${sortBy === "time" ? "text-white font-bold" : "text-white/70"}`}>
                        Total Time
                    </th>

                    <th className={`px-2 py-2 text-left text-xs font-semibold whitespace-nowrap 
                        ${sortBy === "temp" ? "text-white font-bold" : "text-white/70"}`}>
                        Avg Temp
                    </th>

                    </tr>
                </thead>

                <tbody>
                    {sortedLeaderboard.map((user) => {
                    const isTop3 = user.rank <= 3;

                    return (
                        <tr
                        key={user.rank}
                        className={`border-b border-[#2b2b2f] transition-colors
                        ${isTop3 ? "bg-[#e58b0d]/10" : "bg-[#1a1a1d]"}
                        hover:bg-[#232326]`}
                        >
                        <td className="px-2 py-2 text-sm font-bold">{user.rank}</td>

                        <td className="px-2 py-2 text-sm">{user.name}</td>

                        <td className={`px-2 py-2 text-sm ${sortBy === "time" ? "font-bold text-[#fffff]" : "text-[#e58b0d]"}`}>
                            {user.totalTime} min
                        </td>

                        <td className={`px-2 py-2 text-sm ${sortBy === "temp" ? "font-bold text-[#fffff]" : "text-[#e58b0d]"}`}>
                            {user.avgTemp}°C
                        </td>

                        </tr>
                    );
                    })}
                </tbody>
                </table>

            </div>
            </CardContent>
        </Card>
        </TabsContent>

        {/* Social Stats Tab */}
        <TabsContent value="social" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialStats.map((stat, idx) => (
            <Card
                key={idx}
                className="
                bg-[#1a1a1d] 
                border border-[#2b2b2f] 
                rounded-xl 
                hover:border-[#e58b0d]/50 
                transition-colors
                "
            >
                <CardContent className="pb-4"> {/* reduced vertical padding */}
                {/* Title + Icon */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm text-white">{stat.title}</h3>
                    <div className="text-[#e58b0d] -mb-3">{stat.icon}</div>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9"> {/* slightly smaller */}
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-bold">
                        {stat.initials}
                    </AvatarFallback>
                    </Avatar>

                    <div>
                    <p className="font-semibold text-sm text-white">{stat.name}</p>
                    <p className="text-xs text-white/60">{stat.stat}</p>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
        </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}