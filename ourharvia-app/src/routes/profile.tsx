'use client'

import { createFileRoute } from '@tanstack/react-router'
import { ChevronLeft, Settings, Flame, Star, Users, Calendar, Heart, Lock, AlertCircle, Zap, Trophy, Target, TrendingUp, Award, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import saunaImage from '../images/sauna1.jpg'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

export default function ProfilePage() {
  const [selectedBadge, setSelectedBadge] = useState(null)
  const [showLockedBadges, setShowLockedBadges] = useState(false)
  const [showPrefs, setShowPrefs] = useState(false)
  const [showPrefsModal, setShowPrefsModal] = useState(false)
  const [editProfileModal, setEditProfileModal] = useState(false)

  // User data with XP-based level system
  const user = {
    name: 'Alex Miller',
    location: 'Los Angeles, USA',
    avatar: 'AM',
    xp: 2850,
    level: 5,
    sessions: 27,
  }

// Calculate level from XP (every 500 XP = 1 level)
const getLevelFromXP = (xp) => Math.floor(xp / 500) + 1
const getNextLevelXP = (level) => level * 500

// Compute level based on XP (instead of hardcoding)
const level = getLevelFromXP(user.xp)

// XP math for progress bar
const currentLevelMinXP = (level - 1) * 500
const nextLevelXP = getNextLevelXP(level)
const progressToNextLevel =
  ((user.xp - currentLevelMinXP) / (nextLevelXP - currentLevelMinXP)) * 100


  const streak = {
    current: 4,
    longest: 12,
    lastSession: '3 hours ago',
  }

  const badges = [
    {
      id: 1,
      name: 'Heat Hero',
      icon: Flame,
      description: 'Reach 10 sauna sessions',
      achieved: 3,
      requirement: 'Complete sauna sessions',
      color: '#ff6b5b',
    },
    {
      id: 2,
      name: 'Consistency King',
      icon: Calendar,
      description: '7-day streak',
      achieved: 2,
      requirement: 'Maintain a 7-day streak',
      color: '#ffa500',
    },
    {
      id: 3,
      name: 'Recovery Pro',
      icon: Heart,
      description: 'Improve wellness score by 20 points',
      achieved: 1,
      requirement: 'Complete recovery sessions',
      color: '#ff69b4',
    },
    {
      id: 4,
      name: 'Speed Runner',
      icon: Zap,
      description: '10 sessions in one week',
      achieved: 1,
      requirement: 'Complete 10 sessions weekly',
      color: '#ffd700',
    },
    {
      id: 5,
      name: 'Streak Master',
      icon: Trophy,
      description: '30-day streak',
      achieved: 0,
      requirement: 'Maintain a 30-day streak',
      color: '#4169e1',
    },
    {
      id: 6,
      name: 'Century Club',
      icon: Target,
      description: '100 sauna sessions',
      achieved: 0,
      requirement: 'Complete 100 sessions',
      color: '#9370db',
    },
  ]

  const achievedBadges = badges.filter((b) => b.achieved > 0)
  const lockedBadges = badges.filter((b) => b.achieved === 0)

  const recentSessions = [
    {
      id: 1,
      date: "Mar 21",
      duration: 14,
      temperature: 78,
      badgesEarned: [
        { badgeId: 2 }, // Consistency King
        { badgeId: 1 }, // Heat Hero
      ],
    },
    {
      id: 2,
      date: "Mar 20",
      duration: 12,
      temperature: 75,
      badgesEarned: [],
    },
    {
      id: 3,
      date: "Mar 19",
      duration: 15,
      temperature: 80,
      badgesEarned: [],
    },
    {
      id: 4,
      date: "Mar 18",
      duration: 13,
      temperature: 76,
      badgesEarned: [
        { badgeId: 3 }, // Heat Hero
      ],
    },
  ]  
  
  const wellnessData = {
    recovery: {
      hrv: 41,
      hrvStatus: 'Good', // High/Medium/Low
      restingHR: 58,
      bodyBattery: 72,
    },
    sleep: {
      sleepScore: 82,
      deepSleep: '2h 15m',
    },
    stress: {
      stressLevel: 'Medium',
      respiration: 14,
    },
    devices: [
      {
        id: 1,
        name: 'Oura ring',
        status: 'Connected',
        lastSync: '2 min ago',
      },
      {
        id: 2,
        name: 'Garmin Watch',
        status: 'Connected',
        lastSync: '5 min ago',
      },
    ],
  }

  const preferences = {
    temperature: '75°C',
    sessionLength: '12 min',
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#050507' }}>
      <div className="max-w-md mx-auto pb-8">
        {/* SECTION 1: User Identity */}
        {/* TOP BANNER */}
        <div className="relative w-full h-40 rounded-b-3xl overflow-hidden">
        <img
            src={saunaImage}
            alt="Profile banner"
            className="w-full h-full object-cover opacity-80"
        />
        </div>

        {/* PROFILE PICTURE + NAME + BUTTONS */}
        <div className="px-4 relative -mt-12 text-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full mx-auto border-4 border-[#050507] overflow-hidden shadow-lg">
            <img
            src="https://i.pravatar.cc/300?img=12"
            alt="User Profile"
            className="w-full h-full object-cover"
            />
        </div>

        {/* Name */}
        <p className="font-semibold text-white mt-3 text-xl">{user.name}</p>
        <p className="text-xs mt-1" style={{ color: '#999999' }}>
            {user.location}
        </p>

        {/* SECTION: User Level + XP Progress */}
        <div className="mx-4 mt-8" style={{marginTop: "0em"}}>
        <div
            className="p-4 rounded-xl">
            {/* Top row: Level / Sessions / XP */}
            <div className="flex justify-between items-center mb-4">
            <div className="text-center flex-1">
                <p className="text-[10px] uppercase" style={{ color: '#999' }}>Level</p>
                <p className="text-xl font-bold text-white mt-1">{level}</p>
            </div>

            <div
                style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                }}
            />

            <div className="text-center flex-1">
                <p className="text-[10px] uppercase" style={{ color: '#999' }}>Sessions</p>
                <p className="text-xl font-bold text-white mt-1">{user.sessions}</p>
            </div>

            <div
                style={{
                width: '1px',
                height: '40px',
                backgroundColor: 'rgba(255,255,255,0.1)',
                }}
            />

            <div className="text-center flex-1">
                <p className="text-[10px] uppercase" style={{ color: '#999' }}>XP</p>
                <p className="text-xl font-bold text-white mt-1">{user.xp}</p>
            </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mt-3">
            <div
                className="h-2 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: '#2a2a2d' }}
            >
                <div
                className="h-full rounded-full transition-all"
                style={{
                    width: `${progressToNextLevel}%`,
                    backgroundColor: '#c8102e',
                }}
                />
            </div>

            <p
                className="text-[10px] text-right mt-1"
                style={{ color: '#777' }}
            >
                {nextLevelXP - (user.xp)} XP to level {level + 1}
            </p>
            </div>
        </div>
        </div>

            {/* BUTTON ROW */}
            <div className="flex justify-center gap-4 mt-4">

            <button
            onClick={() => setShowPrefsModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-medium"
            style={{
                backgroundColor: '#1a1a1d',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#ffffff',
            }}
            >
            Sauna Settings
            </button>

            {/* Edit Profile */}
            <button
                onClick={() => setEditProfileModal(true)}
                className="px-4 py-2 rounded-xl text-sm font-medium"
                style={{
                backgroundColor: '#c8102e',
                color: 'white',
                }}
            >
                Edit Profile
            </button>
            </div>
        </div>

        {/* SECTION 2: Achievements */}
        <div className="mx-4 mt-10">
          <h2 className="text-base font-semibold text-white text-center">Achievements</h2>

          {/* Streak section */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center justify-between gap-4">
              <div className="text-center flex-1">
                <Flame className="w-6 h-6 mx-auto mb-2" style={{ color: '#c8102e' }} />
                <p className="text-xs" style={{ color: '#999999' }}>Current Streak</p>
                <p className="text-2xl font-bold text-white mt-1">{streak.current}</p>
                <p className="text-xs mt-1" style={{ color: '#666666' }}>days</p>
              </div>
              <div style={{ width: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)', height: '60px' }} />
              <div className="text-center flex-1">
                <Trophy className="w-6 h-6 mx-auto mb-2" style={{ color: '#ffa500' }} />
                <p className="text-xs" style={{ color: '#999999' }}>Longest Streak</p>
                <p className="text-2xl font-bold text-white mt-1">{streak.longest}</p>
                <p className="text-xs mt-1" style={{ color: '#666666' }}>days</p>
              </div>
            </div>
          </div>

          {/* Badges grid - achieved badges only shown by default */}
          <div className="mt-6">
            <p className="text-sm font-medium text-white mb-4 text-center">Badges</p>
            <div className="grid grid-cols-3 gap-4">
              {achievedBadges.map((badge) => {
                const IconComponent = badge.icon
                return (
                  <button
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        background: `conic-gradient(${badge.color}, ${badge.color}dd, ${badge.color})`,
                        padding: '2px',
                      }}
                    >
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#1a1a1d' }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: badge.color }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-white mt-2 text-center leading-tight" style={{ maxWidth: '50px', minHeight: '32px' }}>
                      {badge.name}
                    </p>
                    {badge.achieved > 0 && (
                      <span className="text-xs font-bold mt-1" style={{ color: badge.color }}>
                        ×{badge.achieved}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {lockedBadges.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowLockedBadges(!showLockedBadges)}
                  className="w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: 'transparent',
                    color: '#999999',
                  }}
                >
                  {showLockedBadges ? 'Hide' : 'Show'} locked badges
                  <ChevronDown
                    className="w-4 h-4 transition-transform"
                    style={{
                      transform: showLockedBadges ? 'rotate(180deg)' : 'rotate(0)',
                    }}
                  />
                </button>

                <div
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{
                    maxHeight: showLockedBadges ? '500px' : '0px',
                    opacity: showLockedBadges ? 1 : 0,
                  }}
                >
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {lockedBadges.map((badge) => {
                      const IconComponent = badge.icon
                      return (
                        <button
                          key={badge.id}
                          onClick={() => setSelectedBadge(badge)}
                          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-110"
                        >
                          <div
                            className="w-14 h-14 rounded-full flex items-center justify-center relative opacity-50"
                            style={{
                              backgroundColor: '#2a2a2d',
                            }}
                          >
                            <Lock className="w-5 h-5 absolute" style={{ color: '#999999' }} />
                            <IconComponent
                              className="w-6 h-6"
                              style={{ color: '#555555' }}
                            />
                          </div>
                          <p className="text-xs text-white mt-2 text-center leading-tight" style={{ maxWidth: '50px', minHeight: '32px' }}>
                            {badge.name}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Badge detail modal */}
          {selectedBadge && (
            <div
                className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
                onClick={() => setSelectedBadge(null)}
            >
                <div
                className="w-72 p-6 rounded-2xl shadow-xl animate-scaleIn"
                style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)' }}
                onClick={(e) => e.stopPropagation()}
                >
                {/* Badge icon */}
                <div className="flex justify-center mb-4">
                    <div
                    className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{
                        background: `conic-gradient(${selectedBadge.color}, ${selectedBadge.color}dd, ${selectedBadge.color})`,
                        padding: '3px',
                    }}
                    >
                    <div
                        className="w-full h-full rounded-full flex items-center justify-center"
                        style={{ backgroundColor: '#1a1a1d' }}
                    >
                        <selectedBadge.icon
                        className="w-10 h-10"
                        style={{ color: selectedBadge.color }}
                        />
                    </div>
                    </div>
                </div>

                {/* Badge name */}
                <h3 className="text-white text-lg font-bold text-center">{selectedBadge.name}</h3>

                {/* Earned count */}
                <p className="text-center text-sm mt-1" style={{ color: '#999999' }}>
                    Earned ×{selectedBadge.achieved}
                </p>

                <div className="border-t my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* How to earn */}
                <p
                    className="text-xs uppercase tracking-wide text-center"
                    style={{ color: '#999999' }}
                >
                    How to earn
                </p>
                <p className="text-center text-sm text-white mt-2">
                    {selectedBadge.requirement}
                </p>

                <button
                    className="w-full py-2 rounded-lg font-medium mt-5"
                    style={{ backgroundColor: '#c8102e', color: 'white' }}
                    onClick={() => setSelectedBadge(null)}
                >
                    Close
                </button>
                </div>
            </div>
            )}
        </div>

        {/* SECTION 3: Recent Sessions */}
        <div className="mx-4 mt-10">
        <h2 className="text-base font-semibold text-white text-center">Recent sessions</h2>

        <div className="mt-4 grid grid-cols-2 gap-3">
            {recentSessions.map((session) => (
            <div
                key={session.id}
                className="p-3 rounded-xl text-center flex flex-col justify-between"
                style={{
                backgroundColor: '#1a1a1d',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                minHeight: '140px', // ensures consistent height
                }}
            >
                {/* Date */}
                <p style={{ color: '#999999' }} className="text-xs">
                {session.date}
                </p>

                {/* Duration & temp */}
                <p className="text-white text-sm font-semibold mt-2">
                {session.duration} min
                </p>
                <p style={{ color: '#999999' }} className="text-xs mt-1">
                {session.temperature}°C
                </p>

                {/* Earned badges row */}
                <div className="flex items-center justify-center gap-2 mt-3">
                {session.badgesEarned.slice(0, 3).map((earned, i) => {
                    const badge = badges.find((b) => b.id === earned.badgeId)
                    if (!badge) return null
                    const Icon = badge.icon

                    return (
                    <button
                        key={i}
                        onClick={() => setSelectedBadge(badge)}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{
                        backgroundColor: `${badge.color}22`,
                        border: `1px solid ${badge.color}`,
                        }}
                    >
                        <Icon className="w-4 h-4" style={{ color: badge.color }} />
                    </button>
                    )
                })}

                {/* keep spacing identical */}
                {session.badgesEarned.length === 0 && (
                    <div className="h-7 w-full" />
                )}
                </div>
            </div>
            ))}
        </div>
        </div>

        {/* SECTION 4: Wellness Data - Restructured based on Garmin report */}
        <div className="mx-4 mt-10">
          <h2 className="text-base font-semibold text-white text-center">Wellness data</h2>

          {/* Recovery Card */}
          <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4" style={{ color: '#c8102e' }} />
              <p className="text-xs font-semibold text-white uppercase tracking-wide">Recovery</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">HRV</p>
                <p className="text-sm text-white font-semibold">{wellnessData.recovery.hrv} ms</p>
              </div>
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">Resting HR</p>
                <p className="text-sm text-white font-semibold">{wellnessData.recovery.restingHR} bpm</p>
              </div>
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">Body Battery</p>
                <p className="text-sm text-white font-semibold">{wellnessData.recovery.bodyBattery}%</p>
              </div>
            </div>
          </div>

          {/* Sleep Card */}
          <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4" style={{ color: '#ffa500' }} />
              <p className="text-xs font-semibold text-white uppercase tracking-wide">Sleep</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">Sleep Score</p>
                <p className="text-sm text-white font-semibold">{wellnessData.sleep.sleepScore}</p>
              </div>
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">Deep Sleep</p>
                <p className="text-sm text-white font-semibold">{wellnessData.sleep.deepSleep}</p>
              </div>
            </div>
          </div>

          {/* Stress Card */}
          <div className="mt-3 p-4 rounded-xl" style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4" style={{ color: '#ff6b5b' }} />
              <p className="text-xs font-semibold text-white uppercase tracking-wide">Stress</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">Stress Level</p>
                <p className="text-sm text-white font-semibold">{wellnessData.stress.stressLevel}</p>
              </div>
              <div className="flex justify-between items-center">
                <p style={{ color: '#999999' }} className="text-xs">Respiration</p>
                <p className="text-sm text-white font-semibold">{wellnessData.stress.respiration} bpm</p>
              </div>
            </div>
          </div>

          {/* Connected Devices - displayed in rows */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-white uppercase tracking-wide">Connected Devices</p>
            {wellnessData.devices.map((device) => (
              <div
                key={device.id}
                className="p-3 rounded-lg flex items-center justify-between"
                style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <div>
                  <p className="text-sm text-white font-medium">{device.name}</p>
                  <p style={{ color: '#999999' }} className="text-xs">
                    Last sync: {device.lastSync}
                  </p>
                </div>
                <span
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{ backgroundColor: 'rgba(200, 16, 46, 0.2)', color: '#c8102e' }}
                >
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Preferences Edit Modal */}
        {showPrefsModal && (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setShowPrefsModal(false)}
        >
            <div
            className="w-80 p-6 rounded-2xl shadow-xl animate-scaleIn"
            style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
            >
            <h3 className="text-white text-lg font-bold text-center mb-4">
                Edit Sauna Preferences
            </h3>

            {/* Temperature */}
            <div className="mb-5">
                <p className="text-xs" style={{ color: '#999' }}>Temperature</p>
                <input
                type="range"
                min="60"
                max="100"
                defaultValue="75"
                className="w-full mt-2"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: '#777' }}>
                <span>60°C</span>
                <span>100°C</span>
                </div>
            </div>

            {/* Session length */}
            <div className="mb-5">
                <p className="text-xs" style={{ color: '#999' }}>Session Length</p>
                <input
                type="range"
                min="5"
                max="25"
                defaultValue="12"
                className="w-full mt-2"
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: '#777' }}>
                <span>5 min</span>
                <span>25 min</span>
                </div>
            </div>

            <button
                onClick={() => setShowPrefsModal(false)}
                className="w-full py-2 rounded-lg font-medium mt-2"
                style={{ backgroundColor: '#c8102e', color: 'white' }}
            >
                Save
            </button>
            </div>
        </div>
        )}

        {/* EDIT PROFILE MODAL */}
        {editProfileModal && (
        <div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setEditProfileModal(false)}
        >
            <div
            className="w-80 p-6 rounded-2xl shadow-xl"
            style={{ backgroundColor: '#1a1a1d', border: '1px solid rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
            >
            <h3 className="text-white text-lg font-bold text-center mb-4">
                Edit Profile
            </h3>

            <form className="space-y-4">
                <div>
                <p className="text-xs text-gray-400">Name</p>
                <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a2a2d] text-white text-sm"
                />
                </div>

                <div>
                <p className="text-xs text-gray-400">Email</p>
                <input
                    type="email"
                    defaultValue="alex@example.com"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a2a2d] text-white text-sm"
                />
                </div>

                <div>
                <p className="text-xs text-gray-400">Password</p>
                <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#2a2a2d] text-white text-sm"
                />
                </div>

                <button
                type="submit"
                className="w-full py-2 rounded-lg font-medium"
                style={{ backgroundColor: '#c8102e', color: 'white' }}
                >
                Save changes
                </button>
            </form>
            </div>
        </div>
        )}
    </div>
    
  )
}