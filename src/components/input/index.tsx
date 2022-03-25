import classNames from "classnames";
import { InputHTMLAttributes } from "react";
import styles from './input.module.scss'



export default function Input({ className, ...otherProps }: InputHTMLAttributes<HTMLInputElement>) {

	return <input className={classNames(styles.input, className)} {...otherProps} />
}
