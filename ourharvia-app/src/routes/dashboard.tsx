/** @format */

import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Droplet, Fan, Lightbulb, Mic, Power, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DraggableSlider } from "@/components/draggable-slider";
import { Button } from "@/components/ui/button";
import "./dashboard.css";
import saunaImage from "../images/sauna2.png";
import { createAudioUrlFromText, getSpeechToken, parseTemperatureCommand } from "@/lib/tts";
import { useScribe } from "@elevenlabs/react";
import { CommitStrategy } from "@elevenlabs/elevenlabs-js";
export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isProcessing, setIsProcessing] = useState(false);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [command, setCommand] = useState<string>("");
  const [currentTemp, setCurrentTemp] = useState<number>(80);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  //   const scribe = useScribe({
  //     modelId: "scribe_v2_realtime",
  //     onPartialTranscript: (data) => {
  //       console.log("Partial:", data.text);
  //       setTimeout(() => {
  //         scribe.commit(); // Force finalize transcript
  //         console.log("Committing transcript:", data.text);
  //         setCommand(data.text);
  //         scribe.disconnect(); // Stop recording
  //         setIsListening(false);
  //         setIsProcessing(false);
  //       }, 2000);
  //     },
  //     onCommittedTranscript: (data) => {
  //       console.log("Final transcript:", data.text);
  //       //   scribe.disconnect()
  //       //   Stop recording automatically after receiving final transcript
  //       if (scribe.isConnected) {
  //         scribe.disconnect();
  //       }
  //       setIsProcessing(false);
  //     },
  //   });

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      console.log("Partial:", data.text);
    },
    onCommittedTranscript: (data) => {
      console.log("Final transcript:", data.text);
      setCommand(data.text);

      // Cleanup
      scribe.disconnect();
      setIsListening(false);
      setIsProcessing(false);
    },
  });
  const handlePlayTtsAndRecord = async () => {
    setIsProcessing(true);
    setIsListening((prevState) => !prevState);
    // 1️⃣ Generate TTS
    const url = await createAudioUrlFromText("Hello, what can i do for you today?");
    setAudioUrl(url);

    const audio = new Audio(url);
    audio.play();

    // 2️⃣ When TTS ends, start microphone and transcription
    audio.onended = async () => {
      console.log("TTS finished. Starting microphone...");

      // Fetch single-use Scribe token from your server
      const token = await getSpeechToken();
      console.log("Fetched Scribe token:", token);

      await scribe.connect({
        token,
        languageCode: "eng",
        commitStrategy: CommitStrategy.MANUAL,
        // commitStrategy: CommitStrategy.ma,
        microphone: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // ✅ Simple: commit after 3-4 seconds of recording
      setTimeout(() => {
        console.log("Auto-committing after 4 seconds");
        scribe.commit(); // Triggers onCommittedTranscript
      }, 4000); // Adjust this value (3000-5000ms works well)
    };
  };
  const handleStart = () => {
    console.log("Heating started!");
  };
  const handleStop = () => {
    console.log("Heating stoped!");
  };

  useEffect(() => {
    if (!command) return;

    console.log("Command received:", command);
    const parsedCommand = parseTemperatureCommand(command);

    if (parsedCommand) {
      const { action, value } = parsedCommand;
      setCurrentTemp((prevTemp) => {
        const newTemp = prevTemp + value;
        return Math.max(40, Math.min(newTemp, 100));
      });
      console.log("Parsed Command:", parsedCommand);
    } else {
      console.log("Command not recognized");
    }
  }, [command]);

  //   // ✅ Cleanup timeout on unmount
  //   useEffect(() => {
  //     return () => {
  //       if (timeoutId) clearTimeout(timeoutId);
  //     };
  //   }, [timeoutId]);

  useEffect(() => {
    const handle = handleRef.current;
    const shell = shellRef.current;
    if (!handle || !shell) return;

    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const maxLeft = shell.offsetWidth - handle.offsetWidth - 8;

    const snapTo = (px: number) => {
      handle.classList.add("snap");
      handle.style.left = px + "px";

      setTimeout(() => {
        handle.classList.remove("snap");
      }, 350);
    };

    const onComplete = () => {
      console.log("Sauna Started!");

      handle.dataset.locked = "true";
      snapTo(maxLeft);

      // add active classes
      handle.classList.add("activated");
      shell.classList.add("slider-active");

      const text = shell.querySelector(".slider-text") as HTMLElement | null;
      const arrow = shell.querySelector(".slider-arrow") as HTMLElement | null;

      if (text) text.textContent = "Slide to stop";
      if (arrow) {
        arrow.textContent = "←";
        arrow.classList.add("reverse");
      }
    };

    const onReset = () => {
      console.log("Sauna Stopped!");

      handle.dataset.locked = "false";
      snapTo(0);

      // remove active classes
      handle.classList.remove("activated");
      shell.classList.remove("slider-active");

      const text = shell.querySelector(".slider-text") as HTMLElement | null;
      const arrow = shell.querySelector(".slider-arrow") as HTMLElement | null;

      if (text) text.textContent = "Slide to start";
      if (arrow) {
        arrow.textContent = "→";
        arrow.classList.remove("reverse");
      }
    };

    const onStart = (e: MouseEvent | TouchEvent) => {
      dragging = true;
      startX = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      startLeft = parseInt(handle.style.left || "0", 10);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging) return;

      const x = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const dx = x - startX;

      let newLeft = startLeft + dx;
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      handle.style.left = newLeft + "px";

      // completed ON
      if (newLeft >= maxLeft - 4 && handle.dataset.locked !== "true") {
        dragging = false;
        onComplete();
      }

      // completed OFF
      if (newLeft <= 4 && handle.dataset.locked === "true") {
        dragging = false;
        onReset();
      }
    };

    const onEnd = () => {
      if (!handle) return;
      dragging = false;
      const left = parseInt(handle.style.left || "0", 10);

      // OFF state → snap back left if not fully completed
      if (handle.dataset.locked !== "true") {
        if (left > maxLeft * 0.5) {
          snapTo(0);
        }
        return;
      }

      // ON state → snap back right if not fully completed
      if (handle.dataset.locked === "true") {
        if (left < maxLeft * 0.5) {
          snapTo(maxLeft);
        }
      }
    };

    handle.addEventListener("mousedown", onStart);
    handle.addEventListener("touchstart", onStart);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchend", onEnd);

    return () => {
      handle.removeEventListener("mousedown", onStart);
      handle.removeEventListener("touchstart", onStart);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  return (
    <div className="dashboard-root">
      <div className="dashboard-inner">
        <main className="dashboard-main">
          {/* TOP: Control Dial with Chevrons */}
          <div className="dial-row">
            <button className="chevron-button">
              <ChevronLeft size={32} />
            </button>

            <div className="dial-outer">
              <div className="dial-inner">
                <img src={saunaImage} alt="Sauna banner" className="sauna-background" />

                <span className="dial-mode">Mild</span>

                <span className="dial-temp num-light">
                  {currentTemp}
                  <span className="dial-temp-unit num-regular">°C</span>
                </span>

                <div className="dial-humidity">
                  <Droplet className="dial-humidity-icon num-light" />
                  <span>40%</span>
                </div>

                <span className="dial-time num-regular">1:30</span>
              </div>
            </div>

            <button className="chevron-button">
              <ChevronRight size={32} />
            </button>
          </div>

          {/* MIDDLE: Dots + Fan / Mic / Light */}
          <div className="middle-block">
            <div className="dot-row">
              <div className="dot dot--active" />
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>

            <div className="controls-row">
              <Button variant="ghost" size="icon" className="icon-button">
                <Fan className="icon-svg" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={`icon-button mic-button ${isListening ? "mic-button--active" : "cursor-pointer"}`}
                onClick={handlePlayTtsAndRecord}
              >
                <Mic className="icon-svg" />
              </Button>

              <Button variant="ghost" size="icon" className="icon-button">
                <Lightbulb className="icon-svg" />
              </Button>
            </div>
          </div>

          {/* BOTTOM: Status */}
          <div className="bottom-block">
            <p className="status-text">
              Ready at
              <br />
              <span>08:41</span>
            </p>
          </div>

          {/* BOTTOM: Slider */}
          <DraggableSlider onUnlock={handleStart} onLock={handleStop} />

          {/* VOICE LISTENING OVERLAY */}
          {isListening && (
            <div className="voice-overlay">
              <div className="voice-orb">
                <div className="voice-orb-inner" />
              </div>
              <p className="voice-text">Listening…</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
