import { createFileRoute } from "@tanstack/react-router";
import {
	ChevronLeft,
	ChevronRight,
	Droplet,
	Fan,
	Lightbulb,
	Power,
	User,
} from "lucide-react";
import { DraggableSlider } from "@/components/draggable-slider";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile")({
	component: RouteComponent,
});

function RouteComponent() {
	const handleStart = () => {
		console.log("Heating started!");
	};
	const handleStop = () => {
		console.log("Heating stoped!");
	};
	return (
		<div className="w-full h-screen bg-black text-white flex flex-col items-center p-4 pt-8 max-w-mobile mx-auto">
			<main className="flex flex-col items-center justify-start flex-1 w-full mt-6">
				{/* Control Dial with Chevrons */}
				<div className="flex items-center justify-center w-full">
					<button className="text-white/60 hover:text-white rounded-full bg-transparent">
						<ChevronLeft size={64} />
					</button>

					{/* Gradient ring control dial */}
					<div
						className="aspect-square w-64 h-64 rounded-full flex flex-col items-center justify-center relative
                           bg-gradient-to-br from-orange-900 via-red-700 to-yellow-800 p-1
                           shadow-[0_0_60px_10px_rgba(239,68,68,0.3)]"
					>
						{/* Inner circle with image/translucent bg */}
						<div className="w-full h-full rounded-full bg-black/60 flex flex-col items-center justify-center relative overflow-hidden">
							{/* Background Image */}
							<img
								src="/images/harvia-sauna.webp"
								alt="Harvia Sauna"
								className="absolute inset-0 w-full h-full object-cover opacity-20"
							/>

							<span className="text-2xl pb-4 ">Mild</span>

							<span className="num-light text-6xl text-white">
								85
								<span className="num-regular text-xl align-top text-white font-normal">
									°C
								</span>
							</span>

							<div className="flex items-center gap-2 text-xl text-white mt-2">
								<Droplet className="w-5 h-5" />
								<span className="num-regular text-md">40 %</span>
							</div>
							<span className="num-regular text-white mt-1">1:30</span>
						</div>
					</div>

					<button className="text-white/60 hover:text-white rounded-full bg-transparent">
						<ChevronRight size={64} />
					</button>
				</div>

				{/* Mode Dots */}
				<div className="mt-4 flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-white"></div>
					<div className="w-2 h-2 rounded-full bg-white/30"></div>
					<div className="w-2 h-2 rounded-full bg-white/30"></div>
					<div className="w-2 h-2 rounded-full bg-white/30"></div>
				</div>

				{/* Control Icons */}
				<div className="flex justify-between items-center w-full max-w-xs px-18 my-8">
					<button className="text-white/40 hover:text-white w-10 h-10 p-2 rounded-full bg-transparent">
						<Fan size={32} />
					</button>

					<button className="text-white/40 hover:text-white w-10 h-10 p-2 rounded-full bg-transparent">
						<Lightbulb size={32} />
					</button>
				</div>

				{/* Status Text */}
				<p className="text-center text-2xl text-white/70 mt-4">
					Ready at{" "}
					<span className="font-medium text-white">
						<br />
						19:41
					</span>
				</p>
			</main>

			{/* Footer - Slide to Start */}
			{/* This is a visual mock-up, not a functional slider */}
			<DraggableSlider onUnlock={handleStart} onLock={handleStop} />
		</div>
	);
}
