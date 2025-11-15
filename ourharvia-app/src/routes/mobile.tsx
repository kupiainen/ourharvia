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
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full h-screen bg-black text-white flex flex-col items-center p-4 pt-8 max-w-mobile mx-auto">
			<main className="flex flex-col items-center justify-start flex-1 w-full mt-6">
				{/* Control Dial with Chevrons */}
				<div className="flex items-center justify-center w-full">
					<button className="text-white/60 hover:text-white p-2 rounded-full bg-transparent">
						<ChevronLeft size={32} />
					</button>

          {/* Gradient ring control dial */}
					<div
						className="aspect-square w-64 h-64 rounded-full flex flex-col items-center justify-center relative
                           bg-gradient-to-br from-orange-900 via-red-700 to-yellow-800 p-1
                           shadow-[0_0_60px_10px_rgba(239,68,68,0.3)]"
					>
						{/* Inner circle with image/translucent bg */}
						<div className="w-full h-full rounded-full bg-black/60 flex flex-col items-center justify-center relative overflow-hidden">
							{/* Background Silhouette Placeholder */}
							<User className="absolute -left-2 bottom-0 w-40 h-40 text-white/10" />

							<span className="text-2xl">Mild</span>

							<span className="num-light text-4xl text-white">
								140
								<span className="num-regular text-xl align-top text-white/80 font-normal">
									°F
								</span>
							</span>

							<div className="flex items-center gap-2 text-xl text-white/80 mt-2">
								<Droplet className="w-5 h-5" />
								<span className="num-regular text-md">40 %</span>
							</div>
							<span className="num-regular text-white/80 mt-1">1:30</span>
						</div>
					</div>

					<button className="text-white/60 hover:text-white p-2 rounded-full bg-transparent">
						<ChevronRight size={32} />
					</button>
				</div>

				{/* Control Icons & Dots */}
				<div className="flex justify-between items-center w-full max-w-xs px-4 my-8">
					<Button
						variant="ghost"
						size="icon"
						className="text-white/40 hover:text-white w-10 h-10"
					>
						<Fan className="w-7 h-7" />
					</Button>

					<div className="flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-white"></div>
						<div className="w-2 h-2 rounded-full bg-white/30"></div>
						<div className="w-2 h-2 rounded-full bg-white/30"></div>
						<div className="w-2 h-2 rounded-full bg-white/30"></div>
					</div>

					<Button
						variant="ghost"
						size="icon"
						className="text-white/40 hover:text-white w-10 h-10"
					>
						<Lightbulb className="w-7 h-7" />
					</Button>
				</div>

				{/* Status Text */}
				<p className="text-center text-2xl text-white/70 mt-4">
					Ready at{" "}
					<span className="font-medium text-white">
						<br />
						08:41
					</span>
				</p>
			</main>

			{/* Footer - Slide to Start */}
			{/* This is a visual mock-up, not a functional slider */}
			<footer className="flex justify-center items-center w-full p-6 mt-auto">
				<div className="relative w-full max-w-[300px] h-16 bg-neutral-800 rounded-full flex items-center p-2">
					<div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center flex-shrink-0">
						<Power className="w-7 h-7 text-white" />
					</div>
					<span className="absolute left-1/2 -translate-x-1/2 text-neutral-400">
						Slide to start <span className="font-sans ml-1">&rarr;</span>
					</span>
				</div>
			</footer>
		</div>
	);
}
