import React, {
	DetailsHTMLAttributes,
	FunctionComponent,
	ReactElement,
	SyntheticEvent,
	useState,
} from "react";
import "./style/accordion.scss";
import { useRef } from "react";
import { useEffect } from "react";
import classNames from "classnames";

interface AccordionProps extends DetailsHTMLAttributes<HTMLDetailsElement> {
	summary: ReactElement | string;
	summaryClass?: string;
	wrapperClass?: string;
	isOpened?: boolean;
}

const Accordion: FunctionComponent<AccordionProps> = ({
	summary,
	className,
	summaryClass,
	wrapperClass,
	isOpened,
	children,
	...other
}) => {
	const summaryRef = useRef<HTMLButtonElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const accordionRef = useRef<HTMLDetailsElement>(null);
	const [summaryHeight, setSummaryHeight] = useState("56px");

	const [isClosing, setIsClosing] = useState(false);
	const [isExpanding, setIsExpanding] = useState(false);
	const [animation, setAnimation] = useState<Animation | undefined>();
	const [innerOpened, setInnerOpened] = useState(false);

	useEffect(() => {
		summaryRef.current &&
			setSummaryHeight(`${summaryRef.current.offsetHeight}px`);
	}, [summaryRef.current]);

	const ANIMATION_OPTIONS = {
		duration: 200,
		easing: "ease-out",
	};

	function openAccordion() {
		if (accordionRef.current) {
			// Apply a fixed height on the element
			accordionRef.current.style.height = summaryHeight;

			// Force the [open] attribute on the details element
			accordionRef.current.open = true;

			// Wait for the next frame to call the expand function
			window.requestAnimationFrame(expandAccordion);
		}
	}

	function expandAccordion() {
		if (accordionRef.current) {
			setIsExpanding(true);
			const endHeight = calcExpanded();
			animation && animation.cancel();

			// Start a WAAPI animation
			const currentAnimation = accordionRef.current.animate(
				{
					height: [summaryHeight, endHeight],
				},
				ANIMATION_OPTIONS
			);

			currentAnimation.onfinish = () => handleAnimationFinish(true);
			currentAnimation.oncancel = () => setIsExpanding(false);
			setAnimation(currentAnimation);
		}
	}

	function handleAnimationFinish(open: boolean) {
		if (accordionRef.current) {
			accordionRef.current.open = open;
			accordionRef.current.style.height = "";
		}
		setInnerOpened(open);
		setAnimation(undefined);
		setIsExpanding(false);
		setIsClosing(false);
	}

	function shrinkAccordion() {
		if (accordionRef.current) {
			setIsClosing(true);
			const startHeight = `${accordionRef.current.offsetHeight}px`;

			animation && animation.cancel();

			const currentAnimation = accordionRef.current.animate(
				{
					height: [startHeight, summaryHeight],
				},
				ANIMATION_OPTIONS
			);

			currentAnimation.onfinish = () => handleAnimationFinish(false);
			currentAnimation.oncancel = () => setIsClosing(true);

			setAnimation(currentAnimation);
		}
	}

	function handleSummary(evt: SyntheticEvent<HTMLElement, MouseEvent>) {
		evt.preventDefault();

		const accordion = evt.currentTarget.parentElement as HTMLDetailsElement;

		if (isClosing || !accordion.open) {
			openAccordion();
		}

		if (isExpanding || accordion.open) {
			shrinkAccordion();
		}
	}

	function calcExpanded(): string {
		if (contentRef.current && summaryRef.current) {
			return `${contentRef.current.offsetHeight + summaryRef.current.offsetHeight
			}px`;
		}
		return "152px";
	}

	useEffect(() => {
		if (isOpened) {
			!innerOpened && openAccordion();
		} else {
			shrinkAccordion();
		}
	}, [isOpened, accordionRef.current]);

	return (
		<details
			className={classNames("accordion", className)}
			{...other}
			ref={accordionRef}
			onToggle={(evt) => evt.preventDefault()}
		>
			<summary
				className={summaryClass}
				ref={summaryRef}
				onClick={handleSummary}
			>
				{summary}
			</summary>
			<div
				className={classNames("accordion__content", wrapperClass)}
				ref={contentRef}
			>
				{children}
			</div>
		</details>
	);
};

export default Accordion;
