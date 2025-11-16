# 🔥 ourHarvia — Gamified Wellness Powered by MyHarvia

## 🚩 Problem

Modern saunas — including those powered by MyHarvia’s smart devices — provide rich telemetry such as temperature, humidity, and energy usage.  
However:

- Most users don’t interact with the data beyond basic monitoring  
- Sauna sessions are passive, repetitive, and not personalized  
- There’s no system encouraging regular use, healthier habits, or exploration  
- Existing controls require manual interaction (UI/app), which breaks the relaxation flow  
- Groups and communities lack engaging ways to share progress or compete  

This leaves a huge opportunity for motivation, retention, and deeper engagement.

---

## 🧩 Our Solution

**ourHarvia** – a gamified, intelligent companion for every MyHarvia sauna user.

We turn sauna sessions into an interactive experience by combining:

---

### 🎮 Gamification

Users earn:

- XP and level-ups  
- Challenge badges  
- Streak rewards  
- Seasonal community quests  

Based on actual sauna telemetry like:

- Temperature reached  
- Duration  
- Heart rate changes  
- Heat recovery  
- Session consistency  

---

### 🏆 Smart Challenges

Users can join:

- Personal challenges  
- Group challenges  
- Community-wide global quests  

Challenge progress updates **automatically in real time** from MyHarvia telemetry.

---

### 🎤 Voice Control (New Feature)

Using intelligent voice commands, users can adjust sauna settings **hands-free**:

Examples:

- “Increase temperature to 80°.”  
- “Make it hotter.”  
- “Start a 15-minute session.”  
- “Lower the heat a little.”  

This maintains relaxation, enhances accessibility, and creates a futuristic sauna experience.

---

### 📊 Real-Time Telemetry Integration

We listen to MyHarvia’s live device stream to:

- Track user progress  
- Trigger challenge updates  
- Award XP, badges, streaks instantly  
- Offer live feedback (“You reached peak temperature!”)

---

## 🛠️ Technologies Used

### **Backend**

- **Supabase (Postgres, Realtime, Auth)**  
  - Row-level realtime subscriptions  
  - RLS-secured access  
- **Supabase Realtime**  
  For instant challenge and progress updates
- **Supabase Edge Functions**  
  Processing telemetry events  
- **Node.js + Express**  
  - REST API for challenges, stats, and badges  
- **ElevenLabs API**  
  - Speech-to-Text → Command interpretation  
- **ℹ️ Backend branch:** `backend-init`

---

### **Device Data Integration**

- **MyHarvia Telemetry API**  
  - Real-time temperature, humidity, energy usage, and session metadata  
  - Used to compute XP, streaks, challenge progress  

---

### **Voice Technology**

- **ElevenLabs Speech-to-Text**  
  Converts speech → sauna control commands  
- Natural-language intent interpreter  
- Safety logic (max temp, locked modes, cooldown periods)

---

### **Frontend**

- **React + TypeScript**  
  - Realtime updates for challenges, badges, analytics  
  - Voice control UI  
- Live session tracking dashboard  
- Smooth gamified UI state animations  

---

### **Gamification Engine**

- Trigger-based challenge updater  
- XP + leveling rules  
- Achievement + badge pipeline  
- Consistency and performance analytics  

---

## 💡 Why This Matters

ourHarvia creates a *new category* of smart wellness experience:

- Motivates users to sauna more consistently  
- Makes telemetry meaningful and fun  
- Enables hands-free relaxation via voice control  
- Builds community through shared challenges  
- Helps users track improvements in habits and wellbeing  

It transforms the sauna into a **smart, interactive, personalized wellness partner**.

---

## 🚀 Impact

This system can:

- Increase MyHarvia device engagement  
- Improve retention in the MyHarvia app ecosystem  
- Introduce new subscription-based “challenge seasons”  
- Enable leaderboards, group competition, and analytics  
- Bring a modern gamified wellness layer to traditional sauna culture  

