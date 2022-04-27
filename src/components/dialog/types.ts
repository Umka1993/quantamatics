import { HTMLProps } from "react";

export interface HTMLDialogElement extends HTMLDivElement {
	open: boolean;
	showModal: () => void;
	close: () => void;
	show: () => void;
}

export interface ModalProps extends HTMLProps<HTMLDivElement> {
	closeOnOutsideClick?: boolean;
	onRequestClose: () => void;
	open?: boolean;
	headline?: string;
	wrapperClass?: string;
	variant?: "default" | "right-side" | "user";
	hasCloseButton?: boolean;
	hasWrapper?: boolean;
	modal?: boolean;
}
