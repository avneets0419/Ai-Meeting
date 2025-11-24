'use client';;
import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FrameIcon, MailIcon, PhoneCallIcon } from 'lucide-react';

const footerLinks = [
	{
		label: 'Product',
		links: [
			{ title: 'Features', href: '#features' },
			{ title: 'Pricing', href: '#pricing' },
			{ title: 'Testimonials', href: '#testimonials' },
			
		],
	},


	{
		label: 'Contact',
		links: [
			{ title: '+91 9888032525', href: '#', icon: PhoneCallIcon },
			{ title: 'avneet0419@gmial.com', href: '#', icon: MailIcon },
		],
	},
];

export function Footer() {
	return (
        <footer
            className="md:rounded-t-6xl relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(backgroundColor.white/8%),transparent)] px-6 py-12 lg:py-16">
            <div
                className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />
            <div className="flex w-full flex-col md:flex-row justify-between items-start md:items-center">
				<AnimatedContainer className="space-y-4">
					<FrameIcon className="size-8" />
					<p className="text-muted-foreground mt-8 text-sm md:mt-0">
						© {new Date().getFullYear()} Meet Wise. All rights reserved.
					</p>
				</AnimatedContainer>

				<div
                    className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="mb-10 md:mb-0">
								<h3 className="text-xs font-readex font-bold">{section.label}</h3>
								<ul className="text-muted-foreground mt-4 space-y-2 text-sm font-readex">
									{section.links.map((link) => (
										<li key={link.title} >
											<a
                                                href={link.href}
                                                onClick={(e) => {
													e.preventDefault();
													const targetId = link.href.replace('#', '');
													const target = document.getElementById(targetId);
													if (!target) return;
												
													const startY = window.scrollY;
													const targetY = target.getBoundingClientRect().top + startY;
													const duration = 800; // 👈 Adjust duration here (in ms)
													const startTime = performance.now();
												
													function smoothStep(start, end, point) {
													  if (point <= 0) return start;
													  if (point >= 1) return end;
													  return start + (end - start) * (1 - Math.cos(point * Math.PI)) / 2;
													}
												
													function animateScroll(time) {
													  const elapsed = time - startTime;
													  const progress = Math.min(elapsed / duration, 1);
													  window.scrollTo(0, smoothStep(startY, targetY, progress));
												
													  if (progress < 1) requestAnimationFrame(animateScroll);
													}
												
													requestAnimationFrame(animateScroll);
												  }}
												  className="hover:text-white inline-flex items-center transition-all duration-300"
												>
												{link.icon && <link.icon className="me-1 size-4" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>
        </footer>
    );
}

function AnimatedContainer({
    className,
    delay = 0.1,
    children
}) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return children;
	}

	return (
        <motion.div
            initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
            whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            className={className}>
            {children}
        </motion.div>
    );
}