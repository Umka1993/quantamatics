import { SortDirection } from "../../data/enum";
import { MouseEventHandler, ThHTMLAttributes } from "react";
import { ReactComponent as SortIcon } from "./assets/sort-icon.svg";
import s from "./SortTableHeader.module.scss";
import { ReactComponent as DownArrow } from "./assets/down.svg";
import classNames from "classnames";

type Props = ThHTMLAttributes<HTMLTableHeaderCellElement> & {
	isActive?: boolean;
	name: string;
	direction: SortDirection;
	onClick?: MouseEventHandler<HTMLButtonElement>
};

export default function SortTableHeader({
	className,
	children,
	isActive,
	name,
	direction,
	onClick,
	...other
}: Props) {
	const isDefault = direction === SortDirection.Default;

	return (
		<th
			className={classNames(s.root, className)}
			aria-sort={isActive ? direction : SortDirection.Default}
			{...other}
		>
			<button onClick={onClick} type="button" className={s.button}>
				{children}
				{isActive && !isDefault ? (
					<DownArrow
						aria-hidden
						className={classNames(s.arrow, {
							[s["arrow--up"]]: direction === SortDirection.Up,
						})}
					/>
				) : (
					<SortIcon aria-hidden className={s.arrow} />
				)}
			</button>
		</th>
	);
}
