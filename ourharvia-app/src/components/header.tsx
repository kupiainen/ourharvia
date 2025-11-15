import { ChevronDown, CircleUserRound, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Header() {
	return (
		<header className="max-w-mobile mx-auto bg-black flex justify-between items-center w-full px-4 py-4">
			{/* Left: Hamburger */}
			<Button
				variant="ghost"
				size="icon"
				className="text-white/70 hover:text-white hover:bg-neutral-800"
			>
				<Menu className="w-6 h-6" />
			</Button>

			{/* Center: Split Home + Sauna Dropdown */}
			<div className="flex items-center">
				{/* Home button */}
				<Link to="/dashboard">
					<Button
						variant="ghost"
						className="text-white hover:bg-neutral-800 px-3"
					>
						<span className="text-base font-semibold">My Sauna</span>
					</Button>
				</Link>

				{/* Sauna selector dropdown trigger */}
				<Button
					variant="ghost"
					size="icon"
					className="text-white hover:bg-neutral-800"
				>
					<ChevronDown className="w-5 h-5" />
				</Button>
			</div>

			{/* Right: Profile */}
			<Link to="/profile">
				<Button
					variant="ghost"
					size="icon"
					className="text-white/70 hover:text-white hover:bg-neutral-800"
				>
					<CircleUserRound className="w-6 h-6" />
				</Button>
			</Link>
		</header>
	);
}
