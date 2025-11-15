import { Link } from "@tanstack/react-router";
import { ChevronDown, CircleUserRound, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const closeMenu = () => setIsMenuOpen(false);

	return (
		<>
			<header className="mx-auto bg-black flex justify-between items-center w-full px-4 py-4 relative z-10">
				{/* Left: Hamburger */}
				<Button
					variant="ghost"
					size="icon"
					className="hover:cursor-pointer text-white/70 hover:text-white hover:bg-neutral-800"
					onClick={() => setIsMenuOpen(true)}
				>
					<Menu className="w-10 h-10" />
				</Button>

				{/* Center: Split Home + Sauna Dropdown */}
				<div className="flex items-center">
					{/* Home button */}
					<Link to="/dashboard">
						<Button
							variant="ghost"
							className="hover:cursor-pointer text-white hover:text-white hover:bg-neutral-800 px-3"
						>
							<span className="text-base font-2xl">My Sauna</span>
						</Button>
					</Link>

					{/* Sauna selector dropdown trigger */}
					<Button
						variant="ghost"
						size="icon"
						className="hover:cursor-pointer text-white hover:text-white hover:bg-neutral-800"
					>
						<ChevronDown className="w-10 h-10" />
					</Button>
				</div>

				{/* Right: Profile */}
				<Link to="/profile">
					<Button
						variant="ghost"
						size="icon"
						className="hover:cursor-pointer text-white/70 hover:text-white hover:bg-neutral-800"
					>
						<CircleUserRound className="w-10 h-10" />
					</Button>
				</Link>
			</header>

			{/* --- The Collapsible Full-Screen Menu --- */}
			{isMenuOpen && (
				// --- CHANGE 2: Removed 'p-8' from this div ---
				<div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
					{/* --- CHANGE 3: Changed 'left-4' to 'right-4' --- */}
					<Button
						variant="ghost"
						size="icon"
						className="hover:cursor-pointer text-white/70 hover:text-white hover:bg-neutral-800 absolute top-4 left-4"
						onClick={closeMenu} // <-- Close menu
					>
						<X className="w-10 h-10" />
					</Button>

					{/* Navigation Links */}
					<nav className="flex flex-col items-center gap-6">
						{/* --- FIX: Added 'asChild' and removed invalid 'size' prop --- */}
						<Button
							asChild
							variant="ghost"
							size="navmenu"
							className="text-white/70 hover:text-white hover:bg-neutral-800"
						>
							<Link to="/dashboard" onClick={closeMenu} className="py-2">
								<span className="text-white text-3xl font-semibold">Home</span>
							</Link>
						</Button>

						{/* --- FIX: Added 'asChild' and removed invalid 'size' prop --- */}
						<Button
							asChild
							variant="ghost"
							size="navmenu"
							className="text-white/70 hover:text-white hover:bg-neutral-800"
						>
							<Link to="/challenges" onClick={closeMenu} className="py-2">
								<span className="text-white text-3xl font-semibold">
									Challenges
								</span>
							</Link>
						</Button>

						{/* --- FIX: Added 'asChild' and removed invalid 'size' prop --- */}
						<Button
							asChild
							variant="ghost"
							size="navmenu"
							className="text-white/70 hover:text-white hover:bg-neutral-800"
						>
							<Link to="/scoreboard" onClick={closeMenu} className="py-2">
								<span className="text-white text-3xl font-semibold">
									Scoreboard
								</span>
							</Link>
						</Button>
					</nav>
				</div>
			)}
		</>
	);
}
