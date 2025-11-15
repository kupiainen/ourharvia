import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { Power } from "lucide-react"; // Assuming you use lucide-react for the icon
import { useState } from "react";

// Define component props
interface DraggableSliderProps {
	onUnlock: () => void; // A function to call when unlocked
	onLock: () => void; // A function to call when locked
}

// Define fixed dimensions from your Tailwind classes
const SLIDER_WIDTH = 300; // max-w-[300px]
const KNOB_SIZE = 48; // w-12, h-12 (3rem)
const KNOB_MARGIN = 4; // m-1 (0.25rem)
const CONTAINER_BORDER = 2; // 2px

// Calculate the maximum distance the knob can travel
const CONTAINER_INNER_WIDTH = SLIDER_WIDTH - CONTAINER_BORDER * 2; // 300 - 4 = 296
const KNOB_TOTAL_WIDTH = KNOB_SIZE + KNOB_MARGIN * 2; // 48 + 8 = 56
const MAX_DRAG = CONTAINER_INNER_WIDTH - KNOB_TOTAL_WIDTH; // 296 - 56 = 240

export function DraggableSlider({ onUnlock, onLock }: DraggableSliderProps) {
	const [unlocked, setUnlocked] = useState(false); // <-- Fixed: removed extra '='

	// Use useMotionValue to track the knob's x position
	const x = useMotionValue(0);

	// Use useTransform to map the x position to the text's opacity
	// As x goes from 0 to (MAX_DRAG / 2), opacity goes from 1 to 0
	const textOpacity = useTransform(x, [0, MAX_DRAG / 2], [1, 0]);
	// As x goes from (MAX_DRAG / 2) to MAX_DRAG, opacity goes from 0 to 1
	const stopTextOpacity = useTransform(x, [MAX_DRAG / 2, MAX_DRAG], [0, 1]);

	const handleDragStart = () => {
		// Stop any ongoing animation so drag is responsive
		x.stop();
	};

	// Handle the end of a drag gesture
	const handleDragEnd = () => {
		if (unlocked) {
			// It's currently unlocked. Check if we're sliding to lock it.
			if (x.get() <= 20) {
				// Snap to the start
				animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
				setUnlocked(false);
				onLock(); // Call the onLock callback
			} else {
				// Not at the start, so snap back to the end (stay unlocked)
				animate(x, MAX_DRAG, { type: "spring", stiffness: 300, damping: 20 });
			}
		} else {
			// It's currently locked. Check if we're sliding to unlock it.
			if (x.get() >= MAX_DRAG - 20) {
				// Snap to the end
				animate(x, MAX_DRAG, { type: "spring", stiffness: 300, damping: 20 });
				setUnlocked(true);
				onUnlock(); // Call the onUnlock callback
			} else {
				// Not at the end, so snap back to the start (stay locked)
				animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
			}
		}
	};

	return (
		<footer className="flex justify-center items-center w-full p-6 fixed bottom-8">
			<div
				className="relative flex items-center rounded-full p-0"
				style={{
					width: `${SLIDER_WIDTH}px`,
					// height: `${KNOB_SIZE + 2 * PADDING}px`, // <-- REMOVED
					border: unlocked ? "2px solid #e58b0d" : "2px solid white",
					backgroundColor: unlocked ? "#000000" : "#000000", // bg-green-500 or bg-neutral-800
					transition: "background-color 0.5s ease",
				}}
			>
				{/* Draggable Knob */}
				<motion.div
					className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center m-1" // <-- Added m-1
					style={{
						x, // Bind the knob's x position to the motion value
						border: unlocked ? "2px solid #e58b0d" : "2px solid white",
						backgroundColor: unlocked ? "#e58b0d" : "transparent",
						transition: "border-color 0.5s ease, background-color 0.5s ease",
					}}
					drag="x" // Allow dragging only on the x-axis
					dragConstraints={{ left: 0, right: MAX_DRAG }} // Constrain dragging
					dragMomentum={false} // Disable momentum
					dragElastic={0}
					onDragStart={handleDragStart}
					onDragEnd={handleDragEnd} // Call handler on drag end
				>
					<Power
						className="w-7 h-7"
						style={{ color: unlocked ? "white" : "white" }}
					/>
				</motion.div>

				{/* Text that fades (for locked state) */}
				<motion.span
					className="absolute left-1/2 -translate-x-1/2 text-neutral-400 pointer-events-none"
					style={{
						color: unlocked ? "#e58b0d" : "white", // conditional color

						opacity: unlocked ? 0 : textOpacity,
					}}
				>
					Slide to start{" "}
					<span
						className="font-sans ml-1"
						style={{
							color: unlocked ? "#e58b0d" : "#e58b0d", // conditional color
						}}
					>
						&rarr;
					</span>
				</motion.span>

				{/* Text that fades (for unlocked state) */}
				<motion.span
					className="absolute left-1/2 -translate-x-1/2 text-neutral-400 pointer-events-none"
					style={{
						color: unlocked ? "white" : "white", // conditional color

						opacity: unlocked ? stopTextOpacity : 0,
					}}
				>
					<span
						className="font-sans mr-1"
						style={{
							color: unlocked ? "#e58b0d" : "#e58b0d", // conditional color
						}}
					>
						&larr;
					</span>{" "}
					Slide to stop
				</motion.span>
			</div>
		</footer>
	);
}
