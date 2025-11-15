import { createFileRoute } from "@tanstack/react-router";
import {
	ChevronDown,
	Fan,
	Lightbulb,
	Menu,
	MoreVertical,
	Power,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/mobile")({
	component: RouteComponent,
});

function RouteComponent() {
	// Main container mimics the phone screen
	return (
		<div className="w-full h-screen bg-black text-white flex flex-col items-center p-4 pt-8 max-w-[390px] mx-auto">
			{/* Header */}
			<header className="flex justify-between items-center w-full">
				<Button
					variant="ghost"
					size="icon"
					className="text-white hover:text-white hover:bg-neutral-800"
				>
					<Menu className="w-6 h-6" />
				</Button>
				<div className="flex items-center gap-1 cursor-pointer">
					<span className="text-lg font-semibold">My sauna</span>
					<ChevronDown className="w-5 h-5 text-white/ Enabling this setting will require contributors to sign off on commits made through GitHub’s web interface. Signing off is a way for contributors to affirm that their commit complies with the repository's terms, commonly the Developer Certificate of Origin (DCO). Learn more about signing off on commits. 70" />
				</div>
				<Button
					variant="ghost"
					size="icon"
					className="text-white hover:text-white hover:bg-neutral-800"
				>
					<MoreVertical className="w-6 h-6" />
				</Button>
			</header>

			{/* Main Content Area */}
			<main className="flex flex-col items-center justify-start flex-1 w-full px-6 mt-10">
				{/* Control Dial */}
				{/* This uses a gradient p-2 "border" for the ring and a shadow for the glow */}
				<div
					className="w-64 h-64 rounded-full flex flex-col items-center justify-center relative 
                     bg-gradient-to-br from-red-800 via-orange-700 to-yellow-600 p-2 
                     shadow-[0_0_60px_10px_rgba(249,115,22,0.4)]"
				>
					{/* Inner black circle */}
					<div className="w-full h-full rounded-full bg-black flex flex-col items-center justify-center">
						<span className="text-7xl font-bold text-white tracking-tight">
							45<span className="text-5xl align-top text-white/90">°C</span>
						</span>
						<span className="text-3xl text-white/70 mt-1">15%</span>
					</div>
					{/* Note: The yellow progress arc is omitted for simplicity, as it requires complex SVG or conic-gradients. */}
				</div>

				{/* Control Icons */}
				<div className="flex gap-12 my-10">
					<Button
						variant="ghost"
						size="icon"
						className="text-yellow-500 hover:text-yellow-400 w-12 h-12"
					>
						<Fan className="w-8 h-8" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="text-yellow-500 hover:text-yellow-400 w-12 h-12"
					>
						<Lightbulb className="w-8 h-8" />
					</Button>
				</div>

				{/* Status Text */}
				<p className="text-lg text-white">
					Ready in <span className="font-bold">45 min</span>
				</p>
			</main>

			{/* Footer */}
			<footer className="flex justify-between items-center w-full p-6">
				<p className="text-white/70 text-sm">Slide to stop</p>
				<Button
					size="icon"
					className="rounded-full w-16 h-16 bg-orange-500 hover:bg-orange-600 
                     shadow-lg shadow-orange-500/50 
                     focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-black"
				>
					<Power className="w-8 h-8 text-white" />
				</Button>
			</footer>
		</div>
	);
}
