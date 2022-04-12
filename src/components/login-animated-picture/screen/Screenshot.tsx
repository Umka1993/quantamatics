import style from "./screenshot.module.scss";
import { HTMLAttributes, useState } from "react";
import classNames from "classnames";

type Props = HTMLAttributes<HTMLDivElement> & {
	coefficient?: number
}
// public\img\login\screen.avif
export default function Screenshot({
	className,
	coefficient = 1,
	...other
}: Props) {
	const SCREEN_URL = "img/login/screen";
	return (
		<div className={classNames(style.root, className)} {...other}>
			<picture>
				<source
					srcSet={`${SCREEN_URL}.avif 1x, ${SCREEN_URL}@2x.avif 2x, ${SCREEN_URL}@3x.avif 3x`}
					type="image/avif"
				/>
				<source
					srcSet={`${SCREEN_URL}.webp 1x, ${SCREEN_URL}@2x.webp 2x, ${SCREEN_URL}@3x.webp 3x`}
					type="image/webp"
				/>
				<img
					alt="Screenshot of App"
					src={SCREEN_URL + ".png"}
					srcSet={`${SCREEN_URL}@2x.png 2x,
				${SCREEN_URL}@3x.png 3x`}
				/>
			</picture>

			<svg className={style.graph} width={516} height={146} viewBox="0 0 516 146" fill="none" >
				<g clipPath="url(#clip0_344_2210)">
					<rect width="7.11302" height={64.2891 * coefficient} transform="matrix(1 0 0 -1 8.9314 104.198)" fill="#8FD3FF" />
					<rect width="7.11302" height={46.0579 * coefficient} transform="matrix(1 0 0 -1 49.6582 104.198)" fill="#8FD3FF" />
					<rect width="7.11302" height={49.8961 * coefficient} transform="matrix(1 0 0 -1 95.0396 104.314)" fill="#8FD3FF" />
					<rect x="103.576" y="76.4865" width="7.11302" height={27.8267 * coefficient} fill="#D9D5F3" />
					<rect width="7.7316" height={4.7977 * coefficient} transform="matrix(1 0 0 -1 85.9375 109)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="6.8043" height={2.50335 * coefficient} transform="matrix(1 0 0 -1 134.012 106.665)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height={41.6872 * coefficient} transform="matrix(1 0 0 -1 141.273 103.937)" fill="#8FD3FF" />
					<rect x="149.896" y="65.1256" width="7.18744" height={38.8122 * coefficient} fill="#D9D5F3" />
					<rect width="7.18744" height={42.4059 * coefficient} transform="matrix(1 0 0 -1 185.834 103.937)" fill="#8FD3FF" />
					<rect x="194.458" y="64.4115" width="7.18744" height="39.5309" fill="#D9D5F3" />
					<rect width="6.8043" height="3.3378" transform="matrix(1 0 0 -1 177.927 107.499)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.11302" height="14.3931" transform="matrix(1 0 0 -1 269.546 104.198)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height="62.5308" transform="matrix(1 0 0 -1 277.834 103.937)" fill="#8FD3FF" />
					<rect x="286.459" y="25.597" width="7.18744" height="78.3432" fill="#D9D5F3" />
					<rect width="7.18744" height="50.3121" transform="matrix(1 0 0 -1 321.674 103.937)" fill="#8FD3FF" />
					<rect x="330.3" y="50.7468" width="7.18744" height="53.1871" fill="#D9D5F3" />
					<rect width="7.11302" height="2.87862" transform="matrix(1 0 0 -1 313.55 104.396)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height="76.9057" transform="matrix(1 0 0 -1 411.522 103.937)" fill="#8FD3FF" />
					<rect x="420.148" y="1.16071" width="6.4687" height="102.78" fill="#D9D5F3" />
					<rect width="7.11302" height="24.948" transform="matrix(1 0 0 -1 402.99 104.198)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height="66.8432" transform="matrix(1 0 0 -1 499.209 103.937)" fill="#8FD3FF" />
					<rect x="507.829" y="32.7819" width="7.18744" height="71.1557" fill="#D9D5F3" />
					<rect x="491.005" y="99.3971" width="7.11302" height="0.95954" fill="#F15B79" />
					<rect width="7.11302" height="3.83816" transform="matrix(1 0 0 -1 491.004 104.198)" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height="53.1871" transform="matrix(1 0 0 -1 453.925 103.937)" fill="#8FD3FF" />
					<rect x="462.551" y="55.0695" width="7.18744" height="48.8746" fill="#D9D5F3" />
					<rect x="445.665" y="108.025" width="7.11302" height="0.95954" fill="#F15B79" />
					<rect x="445.665" y="104.191" width="7.11302" height="3.83816" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height="46.7184" transform="matrix(1 0 0 -1 366.958 103.937)" fill="#8FD3FF" />
					<rect x="375.582" y="100.347" width="7.18744" height="3.59372" fill="#D9D5F3" />
					<rect x="358.89" y="104.19" width="7.11302" height="41.2602" fill="#FFD9E0" fillOpacity="0.6" />
					<rect width="7.18744" height="49.5934" transform="matrix(1 0 0 -1 231.834 103.937)" fill="#8FD3FF" />
					<rect x="240.46" y="57.2201" width="7.18744" height="46.7184" fill="#D9D5F3" />
					<rect x="223.583" y="104.184" width="7.11302" height="0.95954" fill="#FFD9E0" fillOpacity="0.6" />
					<g filter="url(#filter0_d_344_2210)">
						<path d="M409.686 74.3571H486.837H515.266" stroke="#DA745E" strokeWidth="0.711302" />
					</g>
					<g filter="url(#filter1_d_344_2210)">
						<path d="M409.686 135.519H486.837H514.776" stroke="#DA745E" strokeWidth="0.711302" />
					</g>
					<path d="M514.613 91.7221V117.47H495.389L464.19 116.99L409.686 117.47V91.7221L434.495 92.042H464.19L495.389 91.7221H514.613Z" fill="#FDDC32" fillOpacity="0.1" />
					<path d="M409.506 74.586V136.191H515.068V74.586H409.506Z" fill="#F4A291" fillOpacity="0.08" />
					<g filter="url(#filter2_d_344_2210)">
						<path d="M409.686 117.312L434.495 116.992H464.19L495.389 117.312H515.34" stroke="#FFCE94" strokeWidth="0.711302" />
					</g>
					<g filter="url(#filter3_d_344_2210)">
						<path d="M515.068 91.4068H482.946L455.882 91.0869L425.434 92.0464H409.687" stroke="#FFCE94" strokeWidth="0.711302" />
					</g>
				</g>
				<defs>
					<filter id="filter0_d_344_2210" x="406.841" y="71.1563" width="111.271" height="6.40172" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset />
						<feGaussianBlur stdDeviation="1.4226" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.879167 0 0 0 0 0.212465 0 0 0 0 0.212465 0 0 0 0.45 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_344_2210" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_344_2210" result="shape" />
					</filter>
					<filter id="filter1_d_344_2210" x="406.841" y="132.318" width="110.78" height="6.40172" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset />
						<feGaussianBlur stdDeviation="1.4226" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.879167 0 0 0 0 0.212465 0 0 0 0 0.212465 0 0 0 0.45 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_344_2210" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_344_2210" result="shape" />
					</filter>
					<filter id="filter2_d_344_2210" x="406.836" y="113.791" width="111.349" height="6.7216" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset />
						<feGaussianBlur stdDeviation="1.4226" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.691667 0 0 0 0 0.672358 0 0 0 0 0.498576 0 0 0 0.55 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_344_2210" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_344_2210" result="shape" />
					</filter>
					<filter id="filter3_d_344_2210" x="406.842" y="87.886" width="111.071" height="7.3615" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
						<feFlood floodOpacity="0" result="BackgroundImageFix" />
						<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
						<feOffset />
						<feGaussianBlur stdDeviation="1.4226" />
						<feColorMatrix type="matrix" values="0 0 0 0 0.691667 0 0 0 0 0.672358 0 0 0 0 0.498576 0 0 0 0.55 0" />
						<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_344_2210" />
						<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_344_2210" result="shape" />
					</filter>
					<clipPath id="clip0_344_2210">
						<rect width="518.737" height="145" fill="white" transform="translate(0.263428 0.47052)" />
					</clipPath>
				</defs>
			</svg>


		</div>
	);
}
