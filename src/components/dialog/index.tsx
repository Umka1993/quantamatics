import useDialogPolyfill from "./hooks/useDialogPolyfill";
import { SyntheticEvent, useEffect, useRef } from "react";

import style from "./Dialog.module.scss";
import classNames from "classnames";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import { HTMLDialogElement, ModalProps } from "./types";
import useCloseOutsideDialog from "./hooks/useCloseOutsideDialog";

export default function Dialog({
	closeOnOutsideClick,
	onRequestClose,
	open,
	children,
	headline,
	wrapperClass,
	id,
	variant = "default",
	hasCloseButton = true,
	hasWrapper = true,
	modal = true,
	...other
}: ModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const lastActiveElement = useRef<Element | null>(null);
	const firstRender = useRef(true);

	useDialogPolyfill(dialogRef);

	useCloseOutsideDialog(
		dialogRef,
		Boolean(modal === false && closeOnOutsideClick),
		open,
		onRequestClose
	);

	useEffect(() => {
		// prevents calling imperative methods on mount since the polyfill will throw an error since we are not using the `open` attribute
		if (firstRender.current) {
			firstRender.current = false;
		} else {
			const dialogNode = dialogRef.current;
			if (open) {
				lastActiveElement.current = document.activeElement;
				if (modal) {
					dialogNode?.showModal();
					document.body.classList.add("scroll-lock");
				} else {
					dialogNode?.show();

				}
			} else {
				dialogNode && dialogNode.close();
				lastActiveElement.current &&
					(lastActiveElement.current as HTMLElement).focus();
				document.body.classList.remove("scroll-lock");
			}
		}
	}, [open]);

	useEffect(() => {
		const dialogNode = dialogRef.current;
		const handleCancel = (event: Event) => {
			event.preventDefault();
			onRequestClose();
		};
		dialogNode && dialogNode.addEventListener("cancel", handleCancel);
		return () => {
			dialogNode && dialogNode.removeEventListener("cancel", handleCancel);
		};
	}, [onRequestClose]);

	function handleOutsideClick(event: SyntheticEvent) {
		const dialogNode = dialogRef.current;

		if (closeOnOutsideClick && event.target === dialogNode && modal) {
			onRequestClose();
		}
	}

	const closeMessage = "Close modal";
	return (
		<dialog
			ref={dialogRef}
			onClick={handleOutsideClick}
			className={[style.root, style[`root--${variant}`]].join(" ")}
			aria-labelledby={`${id}-title`}
		>
			{hasWrapper ? (
				<div
					{...other}
					className={classNames(
						style.wrapper,
						style[`wrapper--${variant}`],
						wrapperClass
					)}
				>
					{headline && (
						<h2 id={`${id}-title`} className={style.title}>
							{headline}
						</h2>
					)}

					{children}
				</div>
			) : (
				children
			)}

			{hasCloseButton && (
				<button className={style.close} onClick={onRequestClose}>
					<SpriteIcon
						icon="cross-close"
						width={16}
						label={closeMessage}
						id={`${id}-close`}
					/>
				</button>
			)}
		</dialog>
	);
}
