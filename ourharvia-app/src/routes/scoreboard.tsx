'use client'

import { useState } from 'react'
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

interface Friend {
  id: string
  name: string
  avatar: string
  initials: string
  wins: number
  losses: number
}

interface LeaderboardUser {
  rank: number
  name: string
  avatar: string
  initials: string
  totalTime: number
  avgTemp: number
  badgesEarned: number
}

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

/* --- Static Data --- */

const friends: Friend[] = [
  { id: '1', name: 'Alex Chen', avatar: '', initials: 'AC', wins: 12, losses: 8 },
  { id: '2', name: 'Jordan Smith', avatar: '', initials: 'JS', wins: 15, losses: 5 },
  { id: '3', name: 'Casey Lee', avatar: '', initials: 'CL', wins: 9, losses: 11 },
  { id: '4', name: 'Morgan White', avatar: '', initials: 'MW', wins: 18, losses: 3 },
]

const leaderboardData: LeaderboardUser[] = [
  { rank: 1, name: 'Morgan White', avatar: '', initials: 'MW', totalTime: 2840, avgTemp: 78, badgesEarned: 12 },
  { rank: 2, name: 'Jordan Smith', avatar: '', initials: 'JS', totalTime: 2650, avgTemp: 76, badgesEarned: 10 },
  { rank: 3, name: 'Alex Chen', avatar: '', initials: 'AC', totalTime: 2420, avgTemp: 75, badgesEarned: 9 },
  { rank: 4, name: 'Casey Lee', avatar: '', initials: 'CL', totalTime: 2100, avgTemp: 74, badgesEarned: 7 },
  { rank: 5, name: 'Your Profile', avatar: '', initials: 'YOU', totalTime: 1890, avgTemp: 73, badgesEarned: 8 },
]

const badges: AchievementBadge[] = [
  {
    id: '1',
    name: 'Heat Master',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-orange-500 to-red-600',
    earned: true,
    progress: 100,
    description: 'Master of high temperatures',
    howToAchieve: 'Reach an average session temperature of 80°C',
  },
  {
    id: '2',
    name: 'Iron Lung',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-600',
    earned: true,
    progress: 100,
    description: 'High humidity warrior',
    howToAchieve: 'Complete 5 sessions with 50%+ humidity',
  },
  {
    id: '3',
    name: 'Consistency King',
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-yellow-500 to-amber-600',
    earned: true,
    progress: 100,
    description: 'Never miss a streak',
    howToAchieve: 'Visit 7 days in a row',
  },
  {
    id: '4',
    name: 'Stamina Beast',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-600',
    earned: false,
    progress: 65,
    description: 'Endurance champion',
    howToAchieve: 'Complete 50 sauna sessions',
  },
  {
    id: '5',
    name: 'Speedrunner',
    icon: <Clock className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-600',
    earned: false,
    progress: 42,
    description: 'Quick session specialist',
    howToAchieve: 'Complete 20 sessions under 15 minutes',
  },
  {
    id: '6',
    name: 'Ice Mage',
    icon: <Medal className="w-6 h-6" />,
    color: 'from-cyan-500 to-blue-600',
    earned: false,
    progress: 28,
    description: 'Cold plunge expert',
    howToAchieve: 'Complete 10 cold plunges',
  },
]

const socialStats = [
  {
    title: 'Most Late-Night Sessions',
    name: 'Morgan White',
    initials: 'MW',
    stat: '42 sessions after 9 PM',
    icon: <Clock className="w-8 h-8" />,
  },
  {
    title: 'Most Sauna Selfies',
    name: 'Alex Chen',
    initials: 'AC',
    stat: '28 photos',
    icon: <Smile className="w-8 h-8" />,
  },
  {
    title: 'Most Talkative',
    name: 'Jordan Smith',
    initials: 'JS',
    stat: '156 minutes of chat',
    icon: <Heart className="w-8 h-8" />,
  },
  {
    title: 'Earliest Riser',
    name: 'Casey Lee',
    initials: 'CL',
    stat: '5:30 AM average start',
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    title: 'Sweatiest Human',
    name: 'Morgan White',
    initials: 'MW',
    stat: '98.6°F peak temp',
    icon: <Flame className="w-8 h-8" />,
  },
  {
    title: 'Sauna Tourist',
    name: 'Jordan Smith',
    initials: 'JS',
    stat: 'Avg 8 min sessions',
    icon: <Target className="w-8 h-8" />,
  },
]

/* --- FIXED COMPONENT --- */

function RouteComponent() {
  const [selectedFriend, setSelectedFriend] = useState<Friend>(friends[0])
  const [timeFilter, setTimeFilter] = useState('week')
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null)
  const [currentTab, setCurrentTab] = useState("1v1")
  const [sortBy, setSortBy] = useState("time");
  
  const currentUser = {
    name: 'Your Profile',
    avatar: '',
    initials: 'YOU',
    stats: {
      totalSessions: 42,
      avgDuration: 28,
      avgTemp: 73,
      avgHumidity: 55,
      longestSession: 45,
      thisWeek: 6,
    },
  }

  const friendStats = {
    totalSessions: 38,
    avgDuration: 26,
    avgTemp: 75,
    avgHumidity: 58,
    longestSession: 42,
    thisWeek: 5,
  }

  const sortedLeaderboard = [...leaderboardData].sort((a, b) => {
    switch (sortBy) {
      case "temp":
        return b.avgTemp - a.avgTemp;
      case "badges":
        return b.badgesEarned - a.badgesEarned;
      default:
        return b.totalTime - a.totalTime; // "time"
    }
  });

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
                {friends.map((friend) => (
                <Button
                    key={friend.id}
                    variant="ghost"
                    onClick={() => setSelectedFriend(friend)}
                    className={`
                    w-full justify-start gap-3 rounded-lg border
                    ${
                        selectedFriend.id === friend.id
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
                    <p
                        className={`text-xs font-bold mt-0.5 ${
                        selectedFriend.wins > selectedFriend.losses
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                    >
                        {selectedFriend.wins}W - {selectedFriend.losses}L
                    </p>
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
                { label: 'Total Sessions', your: currentUser.stats.totalSessions, friend: friendStats.totalSessions },
                { label: 'Avg Duration (min)', your: currentUser.stats.avgDuration, friend: friendStats.avgDuration },
                { label: 'Avg Temperature (°C)', your: currentUser.stats.avgTemp, friend: friendStats.avgTemp },
                { label: 'Avg Humidity (%)', your: currentUser.stats.avgHumidity, friend: friendStats.avgHumidity },
                { label: 'Longest Session (min)', your: currentUser.stats.longestSession, friend: friendStats.longestSession },
                { label: "This Week's Sessions", your: currentUser.stats.thisWeek, friend: friendStats.thisWeek },
                ].map((stat, idx) => {
                const yourIsBigger = stat.your > stat.friend
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
                )
                })}
            </CardContent>
            </Card>

            {/* Graph Preview */}
            <Card className="bg-[#1a1a1d]/80 border border-[#2b2b2f]">
                <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Session Graphs</CardTitle>
                </CardHeader>

                <CardContent>
                <div className="h-40 bg-[#2b2b2f]/60 rounded-md flex items-center justify-center text-white/40">
                    Graph visualization coming soon
                </div>
                </CardContent>
            </Card>
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
                <SelectItem value="badges">Badges</SelectItem>
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

                    <th className={`px-2 py-2 text-left text-xs font-semibold 
                        ${sortBy === "badges" ? "text-white font-bold" : "text-white/70"}`}>
                        Badges
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

                        <td className="px-2 py-2">
                            <Badge
                            className={`bg-[#e58b0d]/20 border border-[#e58b0d]/40 text-[#e58b0d] text-xs px-2 
                            ${sortBy === "badges" ? "font-bold text-[#fffff]" : "text-[#e58b0d]"}`}
                            >
                            {user.badgesEarned}
                            </Badge>
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

        {/* --- Badge Comparison Tab --- */}
        {/* <TabsContent value="badges" className="space-y-8 mt-6 text-white"> */}

        {/* -------- 1. Overall Badge Leaderboard -------- */}
        {/* <Card className="bg-[#1a1a1d]/90 border border-[#2b2b2f] rounded-xl shadow-lg">
            <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
                🏅 Badge Leaderboard
            </CardTitle>
            <CardDescription className="text-white/60">
                See who has earned the most sauna achievements.
            </CardDescription>
            </CardHeader>

            <CardContent className="p-0">
            <table className="w-full text-white text-sm">
                <thead>
                <tr className="bg-[#232326] border-b border-[#2b2b2f]">
                    <th className="px-4 py-3 text-left font-semibold text-white/70">Rank</th>
                    <th className="px-4 py-3 text-left font-semibold text-white/70">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-white/70 whitespace-nowrap">Badges</th>
                    <th className="px-4 py-3 text-left font-semibold text-white/70 whitespace-nowrap">Rare Badges</th>
                </tr>
                </thead>

                <tbody>
                {friends
                    .map((f) => ({
                    ...f,
                    totalBadges: Math.floor(Math.random() * 12) + 3, // Fake demo data
                    rareBadges: Math.floor(Math.random() * 4),
                    }))
                    .sort((a, b) => b.totalBadges - a.totalBadges)
                    .map((f, idx) => (
                    <tr
                        key={f.id}
                        className={`border-b border-[#2b2b2f] ${
                        idx === 0 ? "bg-[#e58b0d]/10" : "bg-[#1a1a1d]"
                        } hover:bg-[#232326] transition-colors`}
                    >
                        <td className="px-4 py-3 font-bold">{idx + 1}</td>
                        <td className="px-4 py-3 flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-blue-500 text-white text-xs font-bold">
                            {f.initials}
                            </AvatarFallback>
                        </Avatar>
                        {f.name}
                        </td>
                        <td className="px-4 py-3 font-semibold">{f.totalBadges}</td>
                        <td className="px-4 py-3 font-semibold text-[#e58b0d]">{f.rareBadges}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            </CardContent>
        </Card> */}

        {/* -------- 2. Category Dominance Cards -------- */}
        {/* <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            🔥 Category Leaders
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
                { id: 'heat', label: 'Heat Mastery', icon: <Flame className="text-[#e58b0d] w-6 h-6" /> },
                { id: 'consistency', label: 'Consistency', icon: <Trophy className="text-[#e58b0d] w-6 h-6" /> },
                { id: 'cold', label: 'Cold Plunge', icon: <Wind className="text-[#e58b0d] w-6 h-6" /> },
                { id: 'speed', label: 'Speedrunner', icon: <Zap className="text-[#e58b0d] w-6 h-6" /> },
                { id: 'humidity', label: 'Humidity Warrior', icon: <Heart className="text-[#e58b0d] w-6 h-6" /> },
                { id: 'stamina', label: 'Stamina Beast', icon: <Target className="text-[#e58b0d] w-6 h-6" /> },
            ].map((cat) => {
                const leader =
                friends[Math.floor(Math.random() * friends.length)] // mock leader
                const runner =
                friends[Math.floor(Math.random() * friends.length)] // mock runner

                return (
                <Card key={cat.id} className="bg-[#1a1a1d] border border-[#2b2b2f] p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-white">{cat.label}</h3>
                    {cat.icon}
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-[#e58b0d] text-black text-xs font-bold">
                        {leader.initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-sm">{leader.name}</p>
                        <p className="text-xs text-[#e58b0d]">#1 in this category</p>
                    </div>
                    </div>

                    <p className="text-xs text-white/50">
                    Runner-up: <span className="text-blue-400">{runner.name}</span>
                    </p>
                </Card>
                )
            })}
            </div>
        </div> */}

        {/* -------- 3. Rare Badge Highlights -------- */}
        {/* <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            🌟 Rare Badges
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges
                .filter((b) => b.earned === true)
                .slice(0, 3)
                .map((badge) => (
                <Card
                    key={badge.id}
                    className="bg-gradient-to-br from-[#e58b0d]/20 to-transparent border border-[#2b2b2f] p-4 rounded-xl"
                >
                    <div className="flex flex-col items-center text-center gap-3">
                    <div className="p-3 rounded-full bg-[#e58b0d]/20">{badge.icon}</div>

                    <h3 className="font-bold">{badge.name}</h3>
                    <p className="text-sm text-white/60">{badge.description}</p>
                    </div>
                </Card>
                ))}
            </div>
        </div> */}

        {/* -------- 4. Closest to Unlocking -------- */}
        {/* <div>
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            ⏳ Almost Earned
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.slice(0, 4).map((friend) => {
                const badge = badges[Math.floor(Math.random() * badges.length)] // demo placeholder
                const progress = Math.floor(Math.random() * 80) + 10

                return (
                <Card key={friend.id} className="bg-[#1a1a1d] border border-[#2b2b2f] rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-blue-500 text-white text-xs font-bold">
                        {friend.initials}
                        </AvatarFallback>
                    </Avatar>

                    <div>
                        <p className="font-semibold">{friend.name}</p>
                        <p className="text-xs text-white/50">Close to unlocking:</p>
                    </div>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-full bg-[#e58b0d]/20">{badge.icon}</div>
                    <span className="font-medium">{badge.name}</span>
                    </div>

                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-white/60 mt-1">{progress}% complete</p>
                </Card>
                )
            })}
            </div>
        </div>

        </TabsContent> */}


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