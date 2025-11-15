import { ChevronDown, CircleUserRound, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
	return (
		<header className="max-w-mobile mx-auto bg-black flex justify-between items-center w-full px-2 py-1">
			{/* Left: Hamburger Menu Icon */}
			<Button
				variant="ghost"
				size="icon"
				className="text-white/70 hover:text-white hover:bg-neutral-800"
			>
				<Menu className="w-6 h-6" />
			</Button>

			{/* Center: "My sauna" Dropdown Button */}
			<Button
				variant="ghost"
				className="text-white hover:text-white hover:bg-neutral-800 flex items-center gap-1 px-3"
			>
				<span className="text-base font-medium">My sauna</span>
				<ChevronDown className="w-5 h-5" />
			</Button>

			{/* Right: User/Profile Icon */}
			<Button
				variant="ghost"
				size="icon"
				className="text-white/70 hover:text-white hover:bg-neutral-800"
			>
				<CircleUserRound className="w-6 h-6" />
			</Button>
		</header>
	);
}
