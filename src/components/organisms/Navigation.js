/* eslint-disable @next/next/no-html-link-for-pages */
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X, User, LogOut, Home, Settings } from 'lucide-react';

export default function Navigation() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [userEmail, setUserEmail] = useState('');

	// Check login status on component mount and when localStorage changes
	useEffect(() => {
		const checkLoginStatus = () => {
			const sessionTicket = localStorage.getItem('playfab_session_ticket');
			const email = localStorage.getItem('user_email');
			
			if (sessionTicket) {
				setIsLoggedIn(true);
				setUserEmail(email || '');
			} else {
				setIsLoggedIn(false);
				setUserEmail('');
			}
		};

		// Check initially
		checkLoginStatus();

		// Listen for storage changes (when user logs in/out in another tab)
		window.addEventListener('storage', checkLoginStatus);

		// Clean up
		return () => {
			window.removeEventListener('storage', checkLoginStatus);
		};
	}, []);

	const handleLogout = () => {
		// Clear localStorage
		localStorage.removeItem('playfab_session_ticket');
		localStorage.removeItem('playfab_id');
		localStorage.removeItem('user_email');
		
		// Update state
		setIsLoggedIn(false);
		setUserEmail('');
		setIsMenuOpen(false);
		
		// Redirect to home page
		window.location.href = '/test';
	};

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = () => {
		setIsMenuOpen(false);
	};

	return (
		<>
			<nav className="sticky top-0 z-50 w-full min-w-0 bg-white px-4 py-1 shadow-md">
				<div className="flex max-w-full items-center justify-between">
					{/* Logo */}
					<div className="flex flex-shrink-0 items-center">
						<a href="/test">
							<Image src="/image/logo.png" alt="Logo" width={50} height={50} />
						</a>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex flex-shrink-0 items-center space-x-4 font-medium">
						{isLoggedIn ? (
							<div className="flex items-center space-x-3">
								<span className="text-sm text-gray-600">
									Halo, {userEmail.split('@')[0]}
								</span>
								<div className="flex items-center space-x-2">
									<a
										href="/dash"
										className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
									>
										<Home className="w-4 h-4" />
										<span>Dashboard</span>
									</a>
									<button
										onClick={handleLogout}
										className="flex items-center space-x-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
									>
										<LogOut className="w-4 h-4" />
										<span>Logout</span>
									</button>
								</div>
							</div>
						) : (
							<a href="/login">
								<button className="flex items-center space-x-1 px-3 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
									<User className="w-4 h-4" />
									<span>Sign In</span>
								</button>
							</a>
						)}
					</div>

					{/* Mobile Burger Menu Button */}
					<div className="md:hidden">
						<button
							onClick={toggleMenu}
							className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
							aria-label="Toggle menu"
						>
							{isMenuOpen ? (
								<X className="w-6 h-6" />
							) : (
								<Menu className="w-6 h-6" />
							)}
						</button>
					</div>
				</div>
			</nav>

			{/* Mobile Menu Overlay */}
			{isMenuOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={closeMenu}
				/>
			)}

			{/* Mobile Menu */}
			<div
				className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
					isMenuOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
			>
				<div className="p-4">
					{/* Close Button */}
					<div className="flex justify-end mb-6">
						<button
							onClick={closeMenu}
							className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Menu Content */}
					<div className="space-y-4">
						{isLoggedIn ? (
							<>
								{/* User Info */}
								<div className="pb-4 border-b border-gray-200">
									<div className="flex items-center space-x-3">
										<div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
											<User className="w-5 h-5 text-emerald-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">
												{userEmail.split('@')[0]}
											</p>
											<p className="text-sm text-gray-500">{userEmail}</p>
										</div>
									</div>
								</div>

								{/* Navigation Links */}
								<div className="space-y-2">
									<a
										href="/dash"
										onClick={closeMenu}
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<Home className="w-5 h-5" />
										<span>Dashboard</span>
									</a>
									<a
										href="/settings"
										onClick={closeMenu}
										className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
									>
										<Settings className="w-5 h-5" />
										<span>Settings</span>
									</a>
								</div>

								{/* Logout Button */}
								<div className="pt-4 border-t border-gray-200">
									<button
										onClick={handleLogout}
										className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
									>
										<LogOut className="w-5 h-5" />
										<span>Logout</span>
									</button>
								</div>
							</>
						) : (
							<>
								{/* Not Logged In */}
								<div className="space-y-4">
									<div className="text-center py-8">
										<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
											<User className="w-8 h-8 text-gray-400" />
										</div>
										<p className="text-gray-600 mb-6">
											Silakan login untuk mengakses semua fitur
										</p>
										<a href="/login" onClick={closeMenu}>
											<button className="w-full bg-gradient-to-l from-[#44CC88] to-[#19AC63] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:from-emerald-600 hover:to-emerald-700">
												Sign In
											</button>
										</a>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</>
	);
}