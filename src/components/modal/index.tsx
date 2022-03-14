import React, {
	FocusEventHandler,
	KeyboardEventHandler,
	ReactNode,
	useEffect,
	useRef,
} from "react";
import "./styles/modal.scss";
import classNames from "classnames";
import CloseIcon from "./assets/close.svg";

interface IModal {
	className?: string;
	children: ReactNode;
	headline?: string;
	onClose: () => void;
}

export const Modal: React.FunctionComponent<IModal> = ({
	children,
	onClose,
	className,
	headline,
}) => {
	const modalRef = useRef<HTMLElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);

	const enum Hint {
		close = "Close modal",
	}

	useEffect(() => {
		modalRef.current?.focus();
	}, []);

	const focusLock: FocusEventHandler<HTMLDivElement> = ({ target }) => {
		target === overlayRef.current && modalRef.current?.focus();
	};

	const closeOnEsc: KeyboardEventHandler<HTMLDivElement> = ({ key }) => {
		(key === "Escape" || key === "Esc") && onClose();
	};

	const closeOnClick = ({ target }: any) => {
		target === overlayRef.current && onClose();
	};

	return (
		<div
			className="modal-overlay"
			aria-label={Hint.close}
			tabIndex={0}
			onFocusCapture={focusLock}
			onClick={closeOnClick}
			ref={overlayRef}
		>
			<article
				role="dialog"
				aria-modal={true}
				className={classNames("modal", className)}
				tabIndex={0}
				ref={modalRef}
				aria-labelledby="modal-label"
				onKeyUp={closeOnEsc}
			>
				{headline && (
					<h1 id="modal-label" className="modal__title">
						{headline}
					</h1>
				)}
				<button
					aria-label={Hint.close}
					title={Hint.close}
					className="modal__close"
					onClick={onClose}
				>
					<CloseIcon aria-hidden />
				</button>
				{children}
			</article>
		</div>
	);
};

export default Modal;
